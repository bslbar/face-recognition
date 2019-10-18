#!/bin/sh

ARTIFACTS_PATH=./artifacts
NODEJS_PATH=${ARTIFACTS_PATH}/nodejs
EXECUTABLE_PATH=${ARTIFACTS_PATH}/exe

rm -rf $ARTIFACTS_PATH
npx tsc --outDir $NODEJS_PATH
cp ./package*.json $NODEJS_PATH
# cp ./scripts/assets/* $NODEJS_PATH
(cd $NODEJS_PATH && npm install --production)

npx pkg --out-path $EXECUTABLE_PATH $NODEJS_PATH/main.js
# cp ./scripts/assets/* $EXECUTABLE_PATH