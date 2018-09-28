#!/bin/sh
set -e
# set -x

FILE=$(cat $1)

replaceInFile () {
  FILE=$(echo "${FILE}" | sed "s/${PATTERN}/${REPLACE}/")
}

PATTERN='^[^\/]*\/\/ \(.*\)\/\/ development$'
REPLACE='\1 \/\/ production'

replaceInFile


PATTERN='^\(.*\)\/\/ development$'
REPLACE='\/\/ \1 \/\/ production'

replaceInFile


echo "${FILE}"
