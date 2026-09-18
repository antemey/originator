#!/bin/sh
set -eu
exec node research/probe.mjs "${1:-mirror}" "${2:-first}"
