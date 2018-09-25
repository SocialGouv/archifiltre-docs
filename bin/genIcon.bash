#!/bin/bash

if [[ "$1" == "install" ]]; then
  sudo apt-get update
  sudo apt-get -y install icnsutils
  sudo apt-get -y install icoutils
fi

filename="$1"
filename_without_ext=$(echo "$filename" | cut -f 1 -d '.')

echo "$filename_without_ext"
icotool -c "$filename" > "filename_without_ext".ico
# png2icns icon.icns icon.png
