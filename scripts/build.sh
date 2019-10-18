#!/bin/sh

rm -rf artifacts
npx tsc
cp ./package*.json ./artifacts
cp ./scripts/assets/* ./artifacts
(cd artifacts && npm install --production)