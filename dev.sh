#!/usr/bin/env bash
# Local dev: rebuilds Tailwind CSS on every change and serves site/ at http://localhost:8000
# Usage:  ./dev.sh        (stop with Ctrl+C)
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -x tools/tailwindcss ]; then
  echo "tools/tailwindcss is missing. See the README (Phase 7) or the setup command in the chat." >&2
  exit 1
fi

# Stop the Tailwind watcher when this script exits
trap 'kill 0' EXIT

./tools/tailwindcss -i site/assets/css/input.css -o site/assets/css/output.css --watch &
echo "Serving http://localhost:8000"
python3 -m http.server 8000 --directory site
