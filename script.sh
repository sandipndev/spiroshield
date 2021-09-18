#!/bin/bash

apt-get update
apt-get install poppler-utils

rm -rf tmp/
rm -rf pdfs/

mkdir tmp
mkdir pdfs
mkdir generated

myscript() {
    rm tmp/*
    rm pdfs/*
    npm run start
}

until myscript; do
    echo "'index.js crashed with exit code $?. Restarting..." >&2
    sleep 1
done