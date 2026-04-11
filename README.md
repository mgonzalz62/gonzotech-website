# GonzoTech.us

Personal home lab website for [gonzotech.us](https://gonzotech.us) — a self-hosted media, cloud storage, gaming, and development ecosystem built on TrueNAS SCALE and Cloudflare.

## What this site is

The main site (`/`) is a clean, public-facing overview of the GonzoTech home lab. It covers what's running, what's been built, and what's in progress — written for a general audience (friends, family, anyone curious).

Content is driven entirely by `data.json` — no HTML edits needed to update projects or automation entries.

## Stack

- **Frontend:** HTML5, CSS3 (Inter + JetBrains Mono via Google Fonts), Vanilla JS
- **Content:** `data.json` — projects and automation cards loaded dynamically
- **Hosting:** Cloudflare Pages (auto-deploys on push to `main`)
- **Public access:** Cloudflare Zero Trust tunnels — no open ports
- **Private access:** Tailscale VPN — internal tools (TrueNAS, ARR stack, Code-Server)

## Project structure

```
gonzotech-website/
├── index.html    # Main site — Home, Services, Projects, Automation, Contact tabs
├── style.css     # All styles — dark theme, responsive, animated
├── script.js     # Tab navigation, data injection, stats count-up, contact form
└── data.json     # All project and automation card content
```

## Live services

| URL | Service |
|-----|---------|
| [watch.gonzotech.us](https://watch.gonzotech.us) | Jellyfin — Media Streaming |
| [photos.gonzotech.us](https://photos.gonzotech.us) | Immich — Photo & Video Backup |
| [play.gonzotech.us](https://play.gonzotech.us) | Romm — Retro Game Library |
| [cloud.gonzotech.us](https://cloud.gonzotech.us) | Nextcloud — File Sync & Storage |
| [office.gonzotech.us](https://office.gonzotech.us) | Collabora — Online Document Editing |
| [auth.gonzotech.us](https://auth.gonzotech.us) | Authentik — Single Sign-On |
| [request.gonzotech.us](https://request.gonzotech.us) | Seerr — Media Requests |
| [status.gonzotech.us](https://status.gonzotech.us) | Uptime Kuma — Service Monitor |

Internal services (Sonarr, Radarr, Prowlarr, qBittorrent, SABnzbd, Code-Server, AdGuard Home) are accessible via Tailscale only.

## Updating content

All project and automation cards are in `data.json`. Edit that file to add, update, or remove entries — no HTML changes needed.

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

Status badge colors: `complete` / `active` → green · `wip` → amber · `planned` → blue

## Deploying

Push to `main` — Cloudflare Pages builds and deploys automatically, usually live within 60 seconds. No build step required.

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

# Node
npx serve .
```

Then open `http://localhost:8080`.

## Home lab

TrueNAS SCALE on a Dell Optiplex 3070 SFF (i5-9500T, 16GB DDR4, 2.5G NIC). 14 active services across media, cloud storage, retro gaming, SSO, and monitoring — all containerized in Docker via Dockge. Public services exposed through Cloudflare Zero Trust tunnels; internal tools via Tailscale VPN.
