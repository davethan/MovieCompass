# MovieCompass

Data scrapping to get the films that are recently in the Athenian theaters

Published: https://athens-cinemas.gr/

## Deploy (Raspberry Pi)

1. Push your changes to `main`.
2. From a PC on the home network, run:

   ```sh
   ssh unexpected-mushroom@192.168.2.9 "~/MovieCompass/deploy.sh"
   ```

   It pulls `main`, builds the frontend and backend (~90 s) and restarts the app. The app then re-scrapes the movies (~45 s). If the pull or the build fails, it stops, and the old version keeps running.

Logs: `ssh unexpected-mushroom@192.168.2.9 "journalctl -u moviecompass -f"`

If the app crashes, it's restarted, but after 3 starts within 15 minutes it gives up and stays down. Find the cause in the logs, then start it again by running `deploy.sh`, or with:

```sh
ssh unexpected-mushroom@192.168.2.9 "sudo systemctl reset-failed moviecompass && sudo systemctl start moviecompass"
```
