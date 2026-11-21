#!/bin/sh
set -e

if [ ! -x node_modules/.bin/nest ]; then
  npm ci
fi

exec "$@"
