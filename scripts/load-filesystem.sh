#!/usr/bin/env bash

VERSION=1.0.2

# Enable better error messages.
shopt -s gnu_errfmt

die () {
    printf '%s\n' "$*" 1>&2
    exit 1
}

usage () {
    cat <<EOF
bash load-filesystem.sh [OPTION...] DIRECTORY > my-output-file
 Options:
   -h, --help    Show this help.
EOF
}

while (($# != 0)); do
    case $1 in
        -h | --help)
            usage
            exit
            ;;
        --)
            # End of all options.
            shift
            break
            ;;
        -?*)
            die "unknown option ($1)"
            ;;
        *)
            # Not an option: break.
            break
            ;;
    esac
    shift
done

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
  *)
      die "unsupported system: $unameOut"
      ;;
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

INITIAL_PATH=$PWD

FILE_PATH=$PWD/$1

cd "$FILE_PATH" || die "could not chdir to $FILE_PATH"

ANALYZED_FOLDER_PATH=$PWD

echo $VERSION
echo unix
echo "$ANALYZED_FOLDER_PATH"

find "$ANALYZED_FOLDER_PATH" -type f -print0 | while read -r -d '' path; do
    FILE_STAT=$($STAT "$STAT_FORMAT" "$path")
    if (($?)); then
        echo "warning: could not stat $path" 1>&2
        continue
    fi

    read -r FILE_HASH FILENAME < <($MD5 "$path")
    if (($?)); then
        echo "warning: could not md5sum $path" 1>&2
        continue
    fi

    echo "$FILE_STAT,$FILE_HASH"
done
