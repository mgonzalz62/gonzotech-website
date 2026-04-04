# GonzoTech.us

Personal home lab website for [gonzotech.us](https://gonzotech.us) — a self-hosted media, gaming, and development ecosystem built on TrueNAS and Cloudflare.

## What this site is

The main site (`/`) is a clean, public-facing overview of the GonzoTech home lab. It covers what's running, what's been built, and what's in progress — written for a general audience.

The docs section (`/docs/`) is a detailed technical reference covering setup steps, configuration, architecture decisions, and a running roadmap. Built for personal reference and anyone curious about the specifics.

## Stack

- **Frontend:** HTML5, CSS3 (Inter + JetBrains Mono via Google Fonts), Vanilla JS
- **Content:** `data.json` — projects and automation entries are loaded dynamically
- **Hosting:** Cloudflare Pages (auto-deploys on push to `main`)
- **DNS & Tunnels:** Cloudflare — all subdomains route through Zero Trust tunnels

## Project structure

```
gonzotech-website/
├── index.html       # Main site
├── style.css        # All styles
├── script.js        # Tab navigation, data injection, contact form
├── data.json        # Projects and automation content
└── docs/
    └── index.html   # Full technical documentation (self-contained)
```

## Updating content

Projects and automation entries live in `data.json`. Edit that file to add, update, or remove cards — no HTML changes needed.

```json
{
  "projects": [
    {
      "name": "Project name",
      "status": "complete | wip | planned | active",
      "description": "What this is and what was done."
    }
  ],
  "automation": [...]
}
```

Status values map to badge colors: `complete` / `active` → green, `wip` → amber, `planned` → blue.

## Deploying

Push to `main` and Cloudflare Pages builds automatically — usually live within 60 seconds. No build step required.

```bash
git add .
git commit -m "your message"
git push
```

## Running locally

Open `index.html` directly in a browser. If `data.json` doesn't load (some browsers block local fetch requests), use a simple local server:

```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .
```

Then open `http://localhost:8080`.

## Home lab

The site documents a TrueNAS SCALE home lab running on a Dell Optiplex 3070 SFF. Active services include Jellyfin, Immich, Romm, Sonarr, Radarr, Prowlarr, qBittorrent (via Gluetun/NordVPN), Uptime Kuma, and Code-Server — all containerized in Docker via Dockge and exposed through Cloudflare tunnels.
