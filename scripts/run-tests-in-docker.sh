#!/usr/bin/env bash
docker-compose build tests
docker-compose run tests || true
docker-compose down
docker image prune -f
