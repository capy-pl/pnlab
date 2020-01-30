#! /bin/bash

if [ -n "$1" ]; then
    case "$1" in
    docker)
        if [ -n "$2" ]; then
            case "$2" in
            build)
                if [ -n "$3" ]; then
                    case "$3" in
                        pn-server)
                            docker-compose \
                            -f ./docker/docker-compose.yml \
                            build \
                            --no-cache \
                            pn-server
                        ;;

                        pn-service)
                            docker-compose \
                            -f ./docker/docker-compose.yml \
                            build pn-service
                        ;;

                        *)
                            echo "Not valid service name."
                        ;;
                    esac
                else 
                    echo "Haven't specify a certain service. Build all services."
                    docker-compose \
                    -f ./docker/docker-compose.yml \
                    build
                fi
            ;;

            build-server)
                docker build \
                -t pnlab-server:1.0.4 \
                -f ./docker/server.Dockerfile .
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
                    pnlab-server:1.0.2 \
                ;;

            run-py)
                docker run \
                    --network pnlab \
                    -d \
                    --mount source=pnlab,target=/var/pnlab/temp \
                    --name pn-python \
                    pnlab-service:1.0.2
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
                echo "UP"
                docker-compose \
                    -f ./docker/docker-compose.yml \
                    up \
                    -d
                ;;

            down)
                docker-compose \
                    -f ./docker/docker-compose.yml \
                    down \
                ;;

            deploy)
                if [ -n "$3" ]; then
                    # case
                    #     pn-server)
                    #     ;;
                    #     pn-service)
                    #     ;;
                    #     *)
                    #         echo "Not a valid service name."
                    #     ;;
                    # esac
                    echo "Test."
                else
                    echo "Haven't specify a certain service. Redeploy two servcices."
                fi
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
