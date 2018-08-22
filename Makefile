image_name = cheap-exp
pwd = $(shell pwd)

.PHONY: electron


all: devServer

runProd: prod
	sudo docker run \
		--rm \
		--network=host \
		-it \
		$(image_name):prod

devServer: dev
	sudo docker run \
		--rm \
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





TP = './src/**/*.test.js'

test: dev
	sudo docker run \
		--network host \
		-it \
		$(image_name):dev \
		npm test $(TP)






electron: dev
	rm -fr ./electron/dist
	sudo docker run -d --name=$(image_name)_electron $(image_name):dev sh
	sudo docker cp $(image_name)_electron:/usr/src/app/dist ./electron
	sudo docker container stop $(image_name)_electron
	sudo docker container rm $(image_name)_electron
	sudo chmod -R 777 ./electron/dist
	npm --prefix ./electron install
	npm --prefix ./electron run-script electron

