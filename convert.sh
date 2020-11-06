#!/bin/bash
shopt -s nullglob dotglob     # To include hidden files
files=(./convertMe/*)
if [ ${#files[@]} -gt 0 ]; then

for file in ./convertMe/*
do
   /usr/bin/ebook-convert "$file" "./books/$(basename "$file" | cut -d. -f1).mobi"
done
rm ./convertMe/*.epub
else

echo "No Books Found";

fi

