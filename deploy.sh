#!/bin/bash
rm ReviewBuddy.zip
echo "Cleaned up old compressed file"

mkdir ReviewBuddy
echo "Created directory"

cp *.js ReviewBuddy/
cp *.json ReviewBuddy/
cp *.html ReviewBuddy/
cp *.png ReviewBuddy/
echo "Copied all files"

zip -R ReviewBuddy.zip ReviewBuddy/*
echo "Created compressed file"

rm -rf ReviewBuddy/
echo "Cleaned up deployment directory"
