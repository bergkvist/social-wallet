#!/bin/bash

function localtunnel {
    lt --port 5000 --subdomain socialwallet2 > /dev/null 
}

until localtunnel; do
echo "localtunnel server crashed"
sleep 2
done