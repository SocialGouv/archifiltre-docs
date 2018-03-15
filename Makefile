image_name = cheap-exp
pwd = $(shell pwd)

all: prod
	sudo docker run \
		--network=host \
		-it \
		$(image_name)

devServer: dev
	sudo docker run \
		--network=host \
		--mount type=bind,source=$(pwd),target=/mnt,readonly \
		-it \
		$(image_name)

dev: clean
	sudo docker build \
		--network=host \
		--target=dev \
		--tag=$(image_name) \
		.

prod: clean
	sudo docker build \
		--network=host \
		--tag=$(image_name) \
		.

clean:
	sudo docker container prune -f
	sudo docker image prune -f
	sudo docker volume prune -f
