#!/bin/sh
# Deploy the latest main on the Raspberry Pi.
# From your PC: ssh unexpected-mushroom@192.168.2.9 "~/MovieCompass/deploy.sh"
# If the pull or the build fails, the script stops and the old version keeps running.
set -e
cd "$(dirname "$0")"

git pull --ff-only

# Cap the build's memory so it fits in the Pi's 1 GB next to the running app.
NODE_OPTIONS=--max-old-space-size=256 node host-build.js

# Manual restarts count toward the service's limit of 3 starts in 15 minutes,
# so clear the counter first (this also revives the app if it gave up).
sudo systemctl reset-failed moviecompass
sudo systemctl restart moviecompass
echo "Deployed $(git log --oneline -1)"
