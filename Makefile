image_name = cheap-exp
pwd = $(shell pwd)

# .PHONY: electron


all: electron_dev

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

electron_dev: dev electron_workspace
	sudo bin/extractWebpackDist.sh $(image_name) dev $(workspace)
	yarn --cwd $(workspace) electron

electron_prod: prod electron_workspace
	sudo bin/extractWebpackDist.sh $(image_name) prod $(workspace)
	bin/toggleDevComment.sh $(workspace)/index.js > /tmp/electron_pack
	cat /tmp/electron_pack > $(workspace)/index.js
	yarn --cwd $(workspace) electron
