const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const startup = require("./utils/startup");
const { APP_PORT } = require("./config");

const verifyAdmin = require("./middlewares/verify-admin");
const verifyUser = require("./middlewares/verify-user");

const adminLogin = require("./routes/admin-login");
const adminVerify = require("./routes/admin-verify");
const changePassword = require("./routes/change-password");
const adminUsk = require("./routes/admin-user-signup-key");
const adminPdfUpload = require("./routes/admin-pdf-upload");
const adminAllPdfs = require("./routes/admin-all-pdfs");
const adminSeePdf = require("./routes/admin-see-pdf");
const adminDeletePdf = require("./routes/admin-delete-pdf");
const adminAllUsers = require("./routes/admin-all-users");
const adminAssignGroupToUser = require("./routes/admin-assign-group-to-user");
const adminTerminateUser = require("./routes/admin-terminate-user");
const adminAssignFile = require("./routes/admin-assign-file");
const adminAllPerms = require("./routes/admin-all-perms");
const adminRffg = require("./routes/admin-remove-file-from-group");
const adminActiveUsers = require("./routes/admin-active-users");
const adminCreateGroup = require("./routes/admin-create-group");
const adminListGroups = require("./routes/admin-list-groups");
const adminDeleteGroup = require("./routes/admin-delete-group");

const userSignup = require("./routes/user-signup");
const userLogin = require("./routes/user-login");
const userVerify = require("./routes/user-verify");
const userAllPdfs = require("./routes/user-all-pdfs");
const userSeePdf = require("./routes/user-see-pdf");

async function main() {
  await startup();
  const app = express();

  app.use(
    fileUpload({
      createParentPath: true,
      useTempFiles: true,
      tempFileDir: path.join(__dirname, "..", "tmp"),
      safeFileNames: true,
      limits: {
        fileSize: 50 * 1024 * 1024,
      },
      abortOnLimit: true,
    })
  );

  app.post("/admin/login", adminLogin);
  app.post("/admin/verify", verifyAdmin, adminVerify);
  app.post("/admin/change-password", verifyAdmin, changePassword);
  app.post("/admin/user-signup-key", verifyAdmin, adminUsk);
  app.post("/admin/pdf-upload", verifyAdmin, adminPdfUpload);
  app.post("/admin/all-pdfs", verifyAdmin, adminAllPdfs);
  app.post("/admin/see-pdf", verifyAdmin, adminSeePdf);
  app.post("/admin/delete-pdf", verifyAdmin, adminDeletePdf);
  app.post("/admin/all-users", verifyAdmin, adminAllUsers);
  app.post("/admin/assign-group-to-user", verifyAdmin, adminAssignGroupToUser);
  app.post("/admin/terminate-user", verifyAdmin, adminTerminateUser);
  app.post("/admin/assign-file-to-group", verifyAdmin, adminAssignFile);
  app.post("/admin/all-permissions", verifyAdmin, adminAllPerms);
  app.post("/admin/remove-file-from-group", verifyAdmin, adminRffg);
  app.post("/admin/active-users", verifyAdmin, adminActiveUsers);
  app.post("/admin/create-group", verifyAdmin, adminCreateGroup);
  app.post("/admin/list-groups", verifyAdmin, adminListGroups);
  app.post("/admin/delete-group", verifyAdmin, adminDeleteGroup);

  app.post("/user/signup", userSignup);
  app.post("/user/login", userLogin);
  app.post("/user/verify", verifyUser, userVerify);
  app.post("/user/all-pdfs", verifyUser, userAllPdfs);
  app.post("/user/see-pdf", verifyUser, userSeePdf);

  app.use(express.static(path.join(__dirname, "..", "ui", "build")));
  app.get("*/*", (_, res) => {
    res.sendFile(path.join(__dirname, "..", "ui", "build", "index.html"));
  });

  app.listen(APP_PORT, "0.0.0.0", () =>
    console.log(`🚀 Server Running on port ${APP_PORT}`)
  );
}

main().catch(console.error);
