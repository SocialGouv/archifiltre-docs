image_name = cheap-exp
pwd = $(shell pwd)

all: devServer

runProd : prod
	sudo docker run \
		--network=host \
		-it \
		$(image_name):prod

devServer: dev
	sudo docker run \
		--network=host \
		--mount type=bind,source=$(pwd),target=/mnt,readonly \
		-it \
		$(image_name):dev

dev: cleanContainer
	sudo docker build \
		--network=host \
		--target=dev \
		--tag=$(image_name):dev \
		.

prod: cleanContainer
	sudo docker build \
		--network=host \
		--tag=$(image_name):prod \
		.

clean: cleanContainer

cleanContainer:
	sudo docker container prune -f
