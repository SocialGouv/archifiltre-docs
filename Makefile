image_name = cheap-exp

all: dev
	sudo docker run --network=host -p 8000:8000 -it $(image_name)

dev: clean
	sudo docker build --network=host --target=dev --tag=$(image_name) .

prod: clean
	sudo docker build --network=host --tag=$(image_name) .

clean:
	sudo docker container prune -f
	sudo docker image prune -f

