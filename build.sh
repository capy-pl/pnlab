#! /bin/bash

if [ -n "$1" ]; then
    case "$1" in
    docker)
        if [ -n "$2" ]; then
            case "$2" in
            build)
                docker-compose \
                    -f docker-compose.yml \
                    build
                ;;

            build-server)
                docker build \
                    -t pnlab-server:1.0.1 \
                    -f ./docker/server.Dockerfile \
                    .
                ;;

            build-py)
                docker build \
                    -t pnlab-service:1.0.1 \
                    -f ./docker/python.Dockerfile \
                    .
                ;;

            build-db)
                docker build -t mongo:pnlab -f ./docker/mongo.Dockerfile .
                ;;

            run-server)
                docker run \
                    --network pnlab \
                    -d \
                    --mount source=pnlab,target=/var/pnlab/temp \
                    -p 3000:3000 \
                    --name pn-server \
                    pnlab:1.0.1
                ;;

            run-py)
                docker run \
                    --network pnlab \
                    -d \
                    --mount source=pnlab,target=/var/pnlab/temp \
                    --name pn-python \
                    pnlab-py:1.0.1
                ;;

            run-db)
                docker run \
                    -d \
                    --network pnlab \
                    -p 27018:27017 \
                    --name pn-db \
                    mongo:pnlab
                ;;

            run-mq)
                docker run \
                    --network pnlab \
                    -d \
                    --name pn-mq \
                    rabbitmq:latest
                ;;

            create-network)
                docker network create --driver bridge pnlab
                ;;

            up)
                docker-compose \
                    -f ./docker/docker-compose.yml \
                    up
                ;;
            *)
                echo "Not a valid docker command."
                ;;
            esac
        else
            echo "Please input a valid docker command."
        fi
        ;;
    *)
        echo "${1} is not a valid command."
        ;;
    esac
else
    echo "Please input a valid command."
fi
