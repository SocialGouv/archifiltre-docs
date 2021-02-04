#!/usr/bin/env bash
VERSION=1.0.1

if [[ $1 = "" ]]
then
  echo "Missing argument. Usage : load-filesystem.sh [folderPath] > my-output-file"
  exit
fi

# Initializing the commands as OSX and linux do not use the same
unameOut="$(uname -s)"
case "${unameOut}" in
  Linux*) machine=Linux;;
  Darwin*) machine=Darwin;;
  *) machine=Unknown
esac

if [[ $machine = Linux ]]
then
  STAT="stat -c"
  STAT_FORMAT="\"%n\",%s,%Y"
  MD5=md5sum
else
  STAT="stat -f"
  STAT_FORMAT="\"%N\",%z,%m"
  MD5="md5 -q"
fi

echo $VERSION
echo unix

INITIAL_PATH=$(pwd)

FILE_PATH=$(pwd)/$1

cd "$FILE_PATH" || exit

ANALYZED_FOLDER_PATH=$(pwd)

echo "$ANALYZED_FOLDER_PATH"

FILE_PATHS=$(find "$ANALYZED_FOLDER_PATH")

for i in $FILE_PATHS; do
  if [[ -f "$i" ]]
  then
    FILE_STAT=$($STAT "$STAT_FORMAT" "$i")
    # We use an array to remove the trailing path that is added on linux by md5sum
    # shellcheck disable=SC2207
    FILE_HASH=($($MD5 "$i"))
    # shellcheck disable=SC2128
    echo "$FILE_STAT,$FILE_HASH"
  fi
done;

cd "$INITIAL_PATH" || exit
