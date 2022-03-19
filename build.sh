#!/bin/bash

WEBSOCKET_ADDRESS=$1

podman build --build-arg WEBSOCKET_ADDRESS=$1 -t docs .
