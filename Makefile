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

# You need to fetch version before test
test: dev
	sudo docker run \
		--network host \
		-it \
		$(image_name):dev \
		npm test $(TP)


# diff -Naur v5 new-v5 > v5.patch
fetchVersion:
	sudo rm -fr version
	git clone -b v5 $(repo) version/v5
	cp patch/v5.patch version
	patch -p 0 -d version -i v5.patch
	sudo chown -R root:root version