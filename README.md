# BLACK GitHub-only License Panel

This version uses GitHub as the storage/backend. No PHP or MySQL is required.

- Public read data: `data/keys.json`
- Admin writes: GitHub Contents API
- Web panel: GitHub Pages
- Admin credential: a fine-grained GitHub token entered in the panel and kept in sessionStorage only. Never commit a token.

## Android integration
The app should read:
https://raw.githubusercontent.com/Black2s11/black-panel-live/main/data/keys.json

Validate the entered key locally: it must exist, have status `active`, and satisfy your duration/device policy.

Important: a public repository means the license list is publicly readable. For confidential licenses, use a real authenticated backend instead.
