.PHONY: build

build:
	docker build -t pnlab:1.0.0 -f server.Dockerfile ..

run:
	docker run \
	--network pnlab \
	-d \
	-p 3000:3000 \
	--name pn-server \
	pnlab:1.0.0

run-db:
	docker run \
	--network pnlab \
	-d \
	--name pn-db \
	mongodb:latest

run-mq:
	docker run \
	--network pnlab \
	-d \
	--name pn-mq \
	rabbitmq:latest

create-network:
	docker network create --driver bridge pnlab
