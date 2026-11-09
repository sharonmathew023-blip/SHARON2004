# Sharon Mathew — portfolio

A static portfolio built with HTML, CSS and browser JavaScript.
[Live site](https://sharonmathew023-blip.github.io/SHARON2004/).

## Prerequisites

These terminal instructions target macOS, Linux, or Windows using WSL with a
POSIX shell (such as Bash). Install:

- [Git](https://git-scm.com/downloads) to clone the repository.
- A supported [Python 3](https://www.python.org/downloads/) release to serve files locally.
- [curl](https://curl.se/download.html) for the HTTP smoke test.
- A current browser (Chrome, Firefox, Safari or Edge) for interactive checks.

On Ubuntu/Debian (including Ubuntu in WSL), install the command-line tools with
`sudo apt-get update && sudo apt-get install git python3 curl`.
On macOS, use the installation links above if the commands below are unavailable.

Confirm the tools are available before continuing:

```sh
git --version
python3 --version
curl --version
```

There is **no dependency installation or build step**: no Node.js, npm, bundler,
backend, database, API keys or `.env` file is needed. The tracked files are the
deployable site. Python is only a local development server, not a site dependency.

## Clone and run

```sh
git clone https://github.com/sharonmathew023-blip/SHARON2004.git
cd SHARON2004
python3 -m http.server 8000 --bind 127.0.0.1
```

Keep this terminal running and open **http://127.0.0.1:8000/** in your browser.
Run the server from the repository root, where `index.html` lives; do not open
the HTML as a `file://` URL. Stop the server with **Ctrl+C** when finished.
The loopback binding keeps this development server local to your machine; it is
not a production server.

Edit `index.html`, `style.css` or `assets/portfolio.js`, save, then refresh the
browser. There is no compilation or automatic reload.

## Smoke test

With the server still running, paste this into a **second terminal**. It can run
from any directory. It exits on the first failed request and prints success only
after every local site resource listed below returns HTTP 200.

```sh
for path in / /index.html '/style.css?v=20261108' \
  '/assets/portfolio.js?v=20261107' /assets/favicon.svg \
  /assets/valentine-preview.webp /assets/social-preview.png \
  /robots.txt /sitemap.xml; do
  status=$(curl --silent --show-error --fail --output /dev/null \
    --write-out '%{http_code}' "http://127.0.0.1:8000$path") || exit 1
  [ "$status" = 200 ] || { echo "FAIL: $path returned $status"; exit 1; }
  printf 'PASS %s (%s)\n' "$path" "$status"
done
echo 'HTTP smoke test passed.'
```

This checks local HTTP serving, not JavaScript behavior or third-party services.
There is no automated unit-test runner or CI configuration in this repository.
Also check these behaviors in the browser:

1. The page loads with styling and the Valentine project image. On a first visit,
   the loading screen disappears; subsequent visits skip it. Reduced-motion
   preferences also skip the loader.
2. The theme button switches light/dark mode and preserves the choice on refresh
   when browser storage is allowed.
3. Navigation links scroll to their sections.
4. The Valentine project card opens a preview dialog. Its close button and Escape
   dismiss it; “Open project” leads to the external project site.

## External services and troubleshooting

- Google Fonts, Instagram embeds, SnapWidget and externally hosted social icons
  require internet access. Privacy extensions or blocked third-party requests
  can leave those areas empty; they are not installed locally. The HTTP smoke
  test intentionally checks only files served by this repository.
- **Command not found:** install the missing prerequisite and reopen the terminal.
  These instructions use `python3`, not the older `python` command.
- **Address already in use:** stop your other server, or use
  `python3 -m http.server 8001 --bind 127.0.0.1` and replace port `8000` with `8001`
  in both the browser URL and smoke test.
- **Connection refused:** keep the first terminal running and check that the
  browser/test uses the same port as the server.
- **Directory listing, wrong page or 404:** stop the server, `cd` into the cloned
  `SHARON2004` directory, and restart it. Check that `index.html` is present.
- **Old styles or scripts:** hard-refresh the browser or disable its cache in
  developer tools. The HTML uses query strings for CSS/JavaScript cache busting;
  update those version strings when publishing changes to those assets.
- **Loader does not replay:** this is expected after the first visit. Clear this
  site's browser storage to check it again (this also resets the saved theme).

## Repository layout and publishing

- `index.html`: content, metadata and inline theme/loader/reveal behavior.
- `style.css`: styles and responsive layouts.
- `assets/portfolio.js`: project preview dialog behavior.
- `assets/`: favicon, project image and social preview image.
- `robots.txt`, `sitemap.xml`: search-engine discovery metadata.

Publish the repository files unchanged to a static host, retaining their relative
paths; there is no `dist/` output. The canonical URL, social metadata, structured
data, `robots.txt` and `sitemap.xml` currently target the live GitHub Pages URL
above. Update these if hosting at a different address. GitHub Pages settings are
managed outside the repository; there is no checked-in deployment workflow.

See [the setup audit](docs/setup-audit.md) for the original gaps and verification
scope.
