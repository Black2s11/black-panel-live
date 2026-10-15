# DARK Uploader+ • Personal License Panel

A separate panel for DARK Uploader+ by @gvvro, hosted under the existing `black-panel-live` repository. The prior BLACK panel and its license list are not changed.

## URLs

- GitHub Pages (if GitHub Pages is enabled for `main` / root): https://black2s11.github.io/black-panel-live/dark-uploader/
- Data: `dark-uploader/keys.json`

## Admin setup

Open the panel, enter a fine-grained GitHub Personal Access Token (Contents read/write scoped to `black-panel-live`). The token is retained in browser `sessionStorage` only, **not** committed. The panel uses GitHub Contents API to manage its separate JSON file.

## Personal-use limitations

**Important: this repository is PUBLIC. All access codes in `keys.json` are publicly readable** and the Chrome extension checks licenses client-side. This is not secure license enforcement. It is for personal testing only; do not use this scheme for paid users, sensitive data, or device-binding. For private account management and reliable revocations/device limits use an authenticated server/database. An extension can be modified to skip client-side checks. Revocation requires the extension to be online. The original Rein Uploader gateway is independent and cannot be authorized or replaced by this panel.

Original Rein Uploader copyright/license remain attributed in the modified extension package.
