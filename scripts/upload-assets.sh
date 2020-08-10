# Run this script to upload the assets to the github release on the current tag
# This script uses the following parameters
# $GITHUB_TOKEN : The Github api token
# $ASSET_NAME : The name of the asset uploaded to Github
# $GITHUB_REPO : The name of the github repository
# $BINARY_PATH : The path to the uploaded binary
# $CI_COMMIT_TAG : The gitlab environment variable for the current tag name
#

export SHA256_FILE_NAME=${ASSET_NAME}-sha256

openssl dgst -sha256 -binary "$BINARY_PATH" | xxd -p -c 32 > $SHA256_FILE_NAME

export GH_API_URL=https://${GITHUB_TOKEN}@api.github.com/repos/${GITHUB_REPO}/releases/tags/${CI_COMMIT_TAG}
echo $GH_API_URL
releaseResponse=$(curl $GH_API_URL)

# Put the release id into $id
eval $(echo "$releaseResponse" | grep -m 1 "id.:" | grep -w id | tr : = | tr -cd '[[:alnum:]]=')

export GH_UPLOAD_URL=https://${GITHUB_TOKEN}@uploads.github.com/repos/${GITHUB_REPO}/releases/$id/assets
curl -X POST --data-binary @"$SHA256_FILE_NAME" -H "Content-Type: application/octet-stream" ${GH_UPLOAD_URL}?name=$SHA256_FILE_NAME
curl -X POST --data-binary @"$BINARY_PATH" -H "Content-Type: application/octet-stream" ${GH_UPLOAD_URL}?name=$ASSET_NAME
