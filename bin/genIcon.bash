#!/bin/bash
set -e
# set -x

if [[ "$1" == "install" ]]
then
  sudo apt-get update
  sudo apt-get -y install imagemagick
  sudo apt-get -y install icnsutils
  sudo apt-get -y install icoutils
else
  filename="$1"
  filename_without_ext=$(echo "$filename" | sed 's/^\(.*\)\.[^\.]*$/\1/')
  working_dir="$(dirname ${filename})"

  size[1]=16x16
  size[2]=32x32
  size[3]=48x48
  size[4]=128x128
  size[5]=256x256
  size[6]=512x512
  size[7]=1024x1024

  for i in $(seq 1 "${#size[@]}")
  do
    size_filename["$i"]="${filename_without_ext}_${size[$i]}.png"
  done



  createResizedFile () {
    for i in $(seq 1 "${#size[@]}")
    do
      convert "$filename" -resize "${size[$i]}" "${size_filename[$i]}"
    done
  }


  deleteResizedFile () {
    for i in $(seq 1 "${#size[@]}")
    do
      rm "${size_filename[$i]}"
    done
  }

  windowsIcon () {
    icotool -c "${size_filename[@]:1:5}" > "$filename_without_ext".ico
  }

  macIcon () {
    png2icns "$filename_without_ext".icns "${size_filename[@]}"
  }

  linuxIcon () {
    mkdir -p "${working_dir}/icons"
    for i in $(seq 1 "${#size[@]}")
    do
      cp \
        "${size_filename[$i]}" \
        "${working_dir}/icons/${size[$i]}.png"
    done
  }


  createResizedFile

  windowsIcon
  macIcon

  deleteResizedFile
  
fi
