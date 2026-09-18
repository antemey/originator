#!/bin/sh
set -eu
# Run from repo/. The marked local WordPress site and pinned Woo plugin must exist.
mode="${1:-mirror}"
case "$mode" in mirror|interaction) ;; *) exit 2 ;; esac
docker compose --env-file research/.env -f research/compose.yml exec -T web \
  php /dev/stdin "$mode" < research/seed/configure.php
