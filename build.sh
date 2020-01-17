#! /bin/bash

if [ -n "$1" ]; then
    case "$1" in
        test)
            echo "test"
            ;;
        *)
            echo "${1} is not a valid command."
            ;;
    esac
else
    echo "Please input a valid command."
fi
