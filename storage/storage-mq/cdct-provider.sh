#!/bin/bash

# abort if any command fails
set -e

dir=$(dirname "$0")
docker-compose -f "${dir}/../../docker-compose.yml" -f "${dir}/../../docker-compose.provider.yml" build storage storage-db storage-mq
docker-compose -f "${dir}/../../docker-compose.yml" -f "${dir}/../../docker-compose.provider.yml" up --scale rabbitmq=0 --scale storage-db-liquibase=0 --exit-code-from storage-mq storage storage-db storage-mq
