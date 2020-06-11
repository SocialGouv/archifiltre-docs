FROM ubuntu:latest

COPY ./test-folder /test
COPY ./load-filesystem.sh /test

ENTRYPOINT "/test/load-filesystem.sh /test/child"
