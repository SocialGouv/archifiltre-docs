image_name = cheap-exp

all:
	sudo docker container prune -f
	sudo docker image prune -f
	sudo docker build --network=host --tag=$(image_name) .
	sudo docker run --network=host -it $(image_name)

clean:
	sudo docker container prune -f
	sudo docker image prune -f

