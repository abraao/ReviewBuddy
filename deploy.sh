#!/bin/bash
rm ReviewBuddy.zip
echo "Cleaned up old compressed file"

mkdir ReviewBuddy
echo "Created directory"

cp *.js ReviewBuddy/
cp *.json ReviewBuddy/
cp *.png ReviewBuddy/
cp -R background ReviewBuddy/
cp -R options ReviewBuddy/
echo "Copied all files"

zip -r ReviewBuddy.zip ReviewBuddy/*
echo "Created compressed file"

rm -rf ReviewBuddy/
echo "Cleaned up deployment directory"
