#!/usr/bin/env bash
# Start the VendorHub status dashboard on http://localhost:4200.
# It checks the backend on localhost:3001 (dev) and localhost:3000 (prod),
# so start those separately if you want the checks to pass.
set -euo pipefail

cd "$(dirname "$0")/status"

[ -d node_modules ] || npm install

exec npm start -- "$@"
