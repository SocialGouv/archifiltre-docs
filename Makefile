repo = https://github.com/jeanbaptisteassouad/cheapExp.git
image_name = cheap-exp
pwd = $(shell pwd)

all: devServer

runProd : prod
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

# Use this to make patchs :
# diff -Naur v5 new-v5 > v5.patch
fetchAndPatch:
	rm -fr version
	git clone -b v5 $(repo) version/v5
	git clone -b v6 $(repo) version/v6
	git clone -b v7 $(repo) version/v7
	cp patch/* version
	patch -p 0 -d version -i v5.patch
	patch -p 0 -d version -i v6.patch
	patch -f -p 0 -d version -i v7.patch
