image_name = cheap-exp
pwd = $(shell pwd)

# .PHONY: electron


all: dev

dev: electron_dev
	yarn --cwd $(workspace) electron

prod: electron_prod
	yarn --cwd $(workspace) electron

release: clean electron_release


clean: docker_clean electron_clean



docker_dev: docker_clean
	sudo docker build \
		--network=host \
		--target=dev \
		--tag=$(image_name):dev \
		.

docker_prod: docker_clean
	sudo docker build \
		--network=host \
		--tag=$(image_name):prod \
		.

docker_clean:
	sudo docker container prune -f




TP = './src/**/*.test.js'

test: docker_dev
	sudo docker run \
		--network host \
		-it \
		$(image_name):dev \
		npm test $(TP)






workspace = './electron/tmpws'

electron_clean:
	rm -fr $(workspace)

electron_workspace:
	mkdir -p $(workspace)
	cp -r electron/src/* $(workspace)
	bin/genIcon.bash $(workspace)/build/icon.png
	yarn --cwd $(workspace) install


electron_dev: docker_dev electron_workspace
	sudo bin/extractWebpackDist.sh $(image_name) dev $(workspace)

electron_dev_pack: electron_dev
	yarn --cwd $(workspace) pack

electron_dev_dist: electron_dev
	yarn --cwd $(workspace) dist


electron_prod: docker_prod electron_workspace
	sudo bin/extractWebpackDist.sh $(image_name) prod $(workspace)
	bin/toggleDevComment.sh $(workspace)/index.js > /tmp/electron_pack
	cat /tmp/electron_pack > $(workspace)/index.js

electron_prod_pack: electron_prod
	yarn --cwd $(workspace) pack

electron_prod_dist: electron_prod
	yarn --cwd $(workspace) dist




electron_release: electron_prod
	yarn --cwd $(workspace) windows64
	mv $(workspace)/dist $(workspace)/windows64
	yarn --cwd $(workspace) windows32
	mv $(workspace)/dist $(workspace)/windows32
	yarn --cwd $(workspace) dist
	mv $(workspace)/dist $(workspace)/linux
