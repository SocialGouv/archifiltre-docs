image_name = cheap-exp
pwd = $(shell pwd)

all: prod
	sudo docker stack deploy -c docker-compose.yml $(image_name)-stack

devServer: dev
	sudo docker run \
		--network=host \
		--mount type=bind,source=$(pwd),target=/mnt,readonly \
		-it \
		$(image_name)

dev: cleanContainer
	sudo docker build \
		--network=host \
		--target=dev \
		--tag=$(image_name) \
		.

prod: cleanContainer
	sudo docker build \
		--network=host \
		--tag=$(image_name) \
		.

clean: cleanContainer cleanImage cleanVolume

cleanContainer:
	sudo docker container prune -f

cleanImage:
	sudo docker image prune -f

cleanVolume:
	sudo docker volume prune -f
