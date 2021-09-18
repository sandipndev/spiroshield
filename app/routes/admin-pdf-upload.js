const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const crypto = require("crypto");

const JSZip = require("jszip");
const sharp = require("sharp");

const pool = require("../db");
const state = require("../utils/state");

module.exports = (req, res) => {
  const f = req.files["pdf-file"];

  if (!req.body["file-name"]) {
    res.status(400).send("NO_NAME");
    fs.unlink(f.tempFilePath, () => {});
    return;
  }

  if (!(f.mimetype === "application/pdf")) {
    res.status(400).send("NOT_PDF");
    fs.unlink(f.tempFilePath, () => {});
    return;
  }

  if (state.processing) {
    res.status(400).send("PROCESSING");
    fs.unlink(f.tempFilePath, () => {});
    return;
  }

  state.processing = true;

  const randomFileName = crypto.randomBytes(10).toString("hex");
  const fname = path.join(
    __dirname,
    "..",
    "..",
    "pdfs",
    randomFileName + ".pdf"
  );

  f.mv(fname, (err) => {
    if (err) {
      res.sendStatus(500);
      fs.unlink(fname, () => {});
      state.processing = false;
      return;
    }

    exec(
      `cd pdfs && pdfinfo ${randomFileName + ".pdf"}`,
      (err, stdout, stderr) => {
        if (String(err).includes("May not be a PDF file")) {
          res.status(400).send("NOT_PDF");
          fs.unlink(fname, () => {});
          state.processing = false;
          return;
        }

        let nPages = parseInt(/Pages:\s*(\d+)/g.exec(stdout)[1]);
        if (nPages > 100) {
          res.status(400).send("PDF_100+");
          fs.unlink(fname, () => {});
          state.processing = false;
          return;
        }

        pool.getConnection((err, conn) => {
          if (err) {
            res.sendStatus(500);
            fs.unlink(fname, () => {});
            state.processing = false;
            conn.release();
            return;
          }

          conn.query(
            `INSERT INTO files(file_name) VALUES (?)`,
            [req.body["file-name"]],
            (err, results) => {
              if (err) {
                res.sendStatus(500);
                fs.unlink(fname, () => {});
                state.processing = false;
                conn.release();
                return;
              }

              res.sendStatus(200);

              const file_id = results.insertId;
              exec(
                `cd ${path.resolve(
                  path.dirname(fname)
                )} && pdftocairo ${randomFileName}.pdf -jpeg`,
                (err) => {
                  if (!err) {
                    /* Delete original pdf */
                    fs.unlink(fname, () => {
                      /* Read pdfs */
                      fs.readdir(
                        path.resolve(path.dirname(fname)),
                        (err, files) => {
                          let counter = 0;
                          if (!err) {
                            const zip = new JSZip();

                            /* Extract each file */
                            files.forEach((filename) => {
                              var pageNo = /-(\d+).jpg/g.exec(filename)[1];
                              /* Split every file into 12 */
                              for (let i = 1; i <= 12; i++) {
                                let sharpImage = sharp(
                                  path.join(
                                    path.resolve(path.dirname(fname)),
                                    filename
                                  )
                                );

                                sharpImage.metadata().then((metadata) => {
                                  const wd = metadata.width;
                                  const ht = metadata.height;

                                  sharpImage
                                    .extract({
                                      left: Math.round((wd * (i - 1)) / 12),
                                      top: 0,
                                      width: Math.round(wd / 12),
                                      height: ht,
                                    })
                                    .toBuffer()
                                    .then((buf) => {
                                      zip.file(
                                        `${pageNo - 1}-${i - 1}.jpg`,
                                        buf.toString("base64"),
                                        { base64: true }
                                      );

                                      counter++;

                                      /* All done */
                                      if (counter === files.length * 12) {
                                        const zipFilePath = path.join(
                                          __dirname,
                                          "..",
                                          "..",
                                          "generated",
                                          `${randomFileName}-${file_id}.zip`
                                        );

                                        zip
                                          .generateNodeStream({
                                            type: "nodebuffer",
                                            streamFiles: true,
                                          })
                                          .pipe(
                                            fs.createWriteStream(zipFilePath)
                                          )
                                          .on("finish", () => {
                                            conn.query(
                                              "UPDATE files SET file_savedas = ? WHERE file_id = ?",
                                              [
                                                `${randomFileName}-${file_id}.zip`,
                                                file_id,
                                              ],
                                              () => {
                                                conn.release();
                                                state.processing = false;
                                              }
                                            );
                                          });

                                        for (const file of files) {
                                          fs.unlink(
                                            path.join(
                                              path.resolve(path.dirname(fname)),
                                              file
                                            ),
                                            () => {}
                                          );
                                        }
                                      }
                                    });
                                });
                              }
                            });
                          }
                        }
                      );
                    });
                  }
                }
              );
            }
          );
        });
      }
    );
  });
};
