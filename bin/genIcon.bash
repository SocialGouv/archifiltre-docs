#!/bin/bash

if [[ "$1" == "install" ]]; then
  sudo apt-get update
  sudo apt-get -y install icnsutils
  sudo apt-get -y install icoutils
fi

filename="$1"
filename_without_ext=$(echo "$filename" | sed 's/^\(.*\)\.[^\.]*$/\1/')

echo "$filename_without_ext"
icotool -c "$filename" > "$filename_without_ext".ico
png2icns "$filename_without_ext".icns "$filename"
