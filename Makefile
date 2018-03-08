image_name = cheap-exp

all:
	sudo docker container prune -f
	sudo docker image prune -f
	sudo docker build --network=host --tag=$(image_name) .
	sudo docker run -p 8000:8000 -it $(image_name)


clean:
	sudo docker container prune -f
	sudo docker image prune -f

