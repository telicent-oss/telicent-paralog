#!/usr/bin/env bash
set -e

CONFIG="./env-config.js";
if [[ -f "$CONFIG" && -d "./public" ]]; then
    cp "$CONFIG" ./public;
    echo "Copied $CONFIG to ./public";
else
    echo "SKIPPED copy of $CONFIG to ./public";
fi

SECRET="./sensitive/secret-config.js";
if [[ -f "$SECRET" && -d "./public" ]]; then
    cp "$SECRET" ./public;
    echo "Copied $SECRET to ./public";
else
    echo "SKIPPED copy of $SECRET to ./public";
fi
