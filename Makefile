image_name = cheap-exp
pwd = $(shell pwd)

.PHONY: electron


all: electron

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
	sudo rm -fr ./electron/webpack
	sudo docker run -d --name=$(image_name)_electron $(image_name):dev sh
	sudo docker cp $(image_name)_electron:/usr/src/app/dist ./electron/webpack
	sudo docker container stop $(image_name)_electron
	sudo docker container rm $(image_name)_electron
	sudo chmod -R 777 ./electron/webpack
	yarn --cwd ./electron install
	yarn --cwd ./electron electron


builder: dev
	sudo rm -fr ./electron/webpack
	sudo docker run -d --name=$(image_name)_electron $(image_name):dev sh
	sudo docker cp $(image_name)_electron:/usr/src/app/dist ./electron/webpack
	sudo docker container stop $(image_name)_electron
	sudo docker container rm $(image_name)_electron
	sudo chmod -R 777 ./electron/webpack
	yarn --cwd ./electron windows
