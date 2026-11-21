#!/bin/sh
set -e
cd "$(dirname "$0")"

if [ "$#" -eq 0 ]; then
  set -- up --build
fi

exec docker compose -f backend/compose.dev.yaml "$@"
