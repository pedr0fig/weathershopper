#!/usr/bin/env bash
COMPOSE_BAKE=true docker compose build tests
docker compose run tests || true
docker compose down
docker image prune -f
