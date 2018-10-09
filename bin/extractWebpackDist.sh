#!/bin/sh
set -e
# set -x

docker_image_name="$1"
webpack_target="$2"
workspace_path="$3"

rm -fr "${workspace_path}/webpack"
docker run -d --name="${docker_image_name}_electron" "${docker_image_name}:${webpack_target}" sh
docker cp "${docker_image_name}_electron":/usr/src/app/dist "${workspace_path}/webpack"
docker container stop "${docker_image_name}_electron"
docker container rm "${docker_image_name}_electron"
chmod -R 777 "${workspace_path}/webpack"
