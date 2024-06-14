#!/usr/bin/env bash
set -e

if [ ! -f "./env-config.js" ]; then
    echo "No ./env-config.js"
    exit 0
fi

if [ -d "./public" ]; then
    echo "Copied ./env-config.js to ./public"
    cp ./env-config.js ./public
fi
