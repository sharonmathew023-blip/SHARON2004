# Clean-checkout setup audit

Date: 2026-11-09

Starting commit: `f528937b3d25abcf11ef966b45a69a7260a15b90`

## Method and original findings

The starting checkout contained the static site but **no README or setup docs**.
Consequently there were no existing documented setup commands to execute or
out-of-date instructions to correct. The audit started by inventorying tracked
files, then cloning the GitHub repository into a new temporary directory, without
copying installed dependencies or configuration from the working checkout.

| Step | Observed result / gap | Resolution |
| --- | --- | --- |
| Find the README and setup guide | Missing; no onboarding entry point. | Added the root README. |
| Determine prerequisites | No tool versions, platform assumptions or environment requirements documented. | Documented Git, Python 3, curl, a browser, POSIX-shell scope and installation links. No secrets or environment files are required. |
| Clone | HTTPS clone succeeded, but no clone command was documented. | Added the actual repository URL and `cd` step. |
| Install dependencies / build | No manifest or build configuration exists; this is a static site, not an incomplete npm project. | Explicitly documented that installation and compilation are unnecessary. |
| Run locally | No server command, working directory, URL or shutdown instructions. | Added a loopback-bound Python server command and its lifecycle. |
| Test | No test runner, CI configuration or documented acceptance checks. | Added a fail-fast HTTP smoke test and a separate browser checklist, with their limits stated. |
| Load external content | Fonts, social icons and embeds use external hosts; offline behavior and blockers were undocumented. | Documented the internet dependency and excluded third-party availability from the local smoke test. |
| Troubleshoot / publish | Ports, caching, persisted browser state and static publishing were undocumented. | Added targeted troubleshooting, file layout and metadata/publishing notes. |

No existing setup script failed: there was no setup script. No application or
script changes were necessary for the local HTTP smoke test.

## Verification and limits

- Used a fresh HTTPS clone on Linux with Git 2.43.0, Python 3.12.3 and curl 8.5.0.
  These tools were already installed on the audit machine; this was a clean
  checkout rehearsal, not a new OS installation or package-installer test.
- Ran the README's `python3 -m http.server 8000 --bind 127.0.0.1` command from the
  clone root and the documented HTTP smoke test in a separate process.
- All nine requests returned HTTP 200, including the HTML, versioned CSS and
  JavaScript URLs, local preview assets, favicon, robots file and sitemap.
- No dependency installation, build artifact, environment variable or application
  configuration was needed.
- The browser checklist was not executed; it is a manual acceptance procedure,
  not coverage provided by the HTTP test. Third-party availability, production deployment settings,
  macOS/WSL execution and prerequisite installers were not verified by this audit.
