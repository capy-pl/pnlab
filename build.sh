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

            create-network)
                    docker network create --driver bridge pnlab
                ;;

            up)
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

            stop)
                docker-compose \
                -f ./docker/docker-compose.yml \
                stop
                ;;

            deploy)
                if [ -n "$3" ]; then
                    case $3 in
                        pn-server)
                        docker-compose \
                            -f ./docker/docker-compose.yml \
                            up \
                            --no-deps \
                            -d \
                            pn-server
                        ;;

                        pn-service)
                        docker-compose \
                            -f ./docker/docker-compose.yml \
                            up \
                            --no-deps \
                            -d \
                            pn-service
                        ;;

                        db)
                            docker-compose \
                            -f ./docker/docker-compose.yml \
                            up \
                            --no-recreate \
                            -d \
                            db
                            ;;

                        mq)
                            docker-compose \
                            -f ./docker/docker-compose.yml \
                            up \
                            --no-recreate \
                            -d \
                            mq
                            ;;
                        *)
                            echo "Not a valid service name."
                        ;;
                    esac
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
