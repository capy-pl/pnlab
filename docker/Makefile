.PHONY: build

build:
	docker build -t pnlab:1.0.1 -f server.Dockerfile ..

build-py:
	docker build -t pnlab-py:1.0.1 -f python.Dockerfile ..
up:
	docker-compose up
run:
	docker run \
	--network pnlab \
	-d \
	--mount source=pnlab,target=/var/pnlab/temp \
	-p 3000:3000 \
	--name pn-server \
	pnlab:1.0.1

run-py:
	docker run \
	--network pnlab \
	-d \
	--mount source=pnlab,target=/var/pnlab/temp \
	--name pn-python \
	pnlab-py:1.0.1

run-db:
	docker run \
	--network pnlab \
	-d \
	-p 27018:27017 \
	--name pn-db \
	mongo:latest

run-mq:
	docker run \
	--network pnlab \
	-d \
	--name pn-mq \
	rabbitmq:latest

create-network:
	docker network create --driver bridge pnlab

initdb:
	MONGO_PORT=27018 && grunt initdb