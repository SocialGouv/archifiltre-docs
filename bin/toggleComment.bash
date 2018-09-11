#!/bin/bash

FILE=$1

while read LINE; do
  echo "This is a line: $LINE"
done < $FILE

myvar=$(ls . | wc -l)

echo $myvar
echo