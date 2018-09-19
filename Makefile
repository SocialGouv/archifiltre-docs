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




workspace = './electron/build'

electron_workspace:
	mkdir -p $(workspace)
	cp electron/src/* $(workspace)
	yarn --cwd $(workspace) install


electron_webpack:
	echo $(webpack_target)
	sudo rm -fr $(workspace)/webpack
	sudo docker run -d --name=$(image_name)_electron $(image_name):$(webpack_target) sh
	sudo docker cp $(image_name)_electron:/usr/src/app/dist $(workspace)/webpack
	sudo docker container stop $(image_name)_electron
	sudo docker container rm $(image_name)_electron
	sudo chmod -R 777 $(workspace)/webpack


electron: dev electron_workspace
	bin/extractWebpackDist.sh $(image_name) dev $(workspace)
	yarn --cwd $(workspace) electron


# electron_builder_pack: prod
# 	sudo rm -fr ./electron/webpack
# 	sudo docker run -d --name=$(image_name)_electron $(image_name):dev sh
# 	sudo docker cp $(image_name)_electron:/usr/src/app/dist ./electron/webpack
# 	sudo docker container stop $(image_name)_electron
# 	sudo docker container rm $(image_name)_electron
# 	sudo chmod -R 777 ./electron/webpack
# 	yarn --cwd ./electron windows
