# DARK Uploader+ — No Token Personal Panel (v4.0.4)

**Panel URL:** https://black2s11.github.io/black-panel-live/dark-uploader/

## Token-free operation

- No GitHub token or password.
- No manual JSON publishing or GitHub commits for code changes.
- Open the panel on the **same Chromium browser/profile** where the **DARK Uploader+ v4.0.4** extension is installed.
- The panel uses the extension's content-script message bridge and `chrome.storage.local`. Generated/disabled/deleted codes save directly in that extension's local storage.
- If the extension is not present, the panel is clearly marked **browser-only storage**, and codes created there do **not** activate the extension.
- No syncing to other devices or different Chrome profiles. Export backups before clearing browser or extension data.
- The original third-party uploader gateway may still require independent authorization.

This is for personal use, **not a secure remote licensing service**. If you later need remotely managed shared subscriptions, use a properly authenticated backend. The previous GitHub-public `keys.json` is legacy and **not used** by the v4.0.4 local panel; older 4.0.3 packages will still read it.

Credits: Dark (@gvvro) for customization. Original Rein LICENSE remains in the extension package.
