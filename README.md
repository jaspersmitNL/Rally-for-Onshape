# Onshape Plus

Make Onshape faster, cleaner, and easier to use.

Onshape Plus is an open-source browser extension that enhances the Onshape experience with touch-friendly controls, pen-focused workflows, floating tools, and productivity improvements for tablet and desktop users.

Available for Chrome, Edge, and Safari on iPad.

## Install

### Chrome

Chrome Web Store:

https://chromewebstore.google.com/detail/onshape-plus/hanbmgaepnkkmmgafdpfocnjhfccckoh

### Safari (iPad)

Available on the App Store.

### Edge

Install from the Chrome Web Store or load the extension manually.

## Features

### Touch & Pen Optimized

* Tablet-friendly interface enhancements
* Quick-access floating toolbar
* Improved pen workflows
* Faster access to common modeling actions

### Productivity Tools

* Floating numeric keypad for fast dimension entry
* One-tap access to common commands
* Dynamic command layouts
* Persistent UI positioning

### Native Look & Feel

* Dark mode integration
* Onshape-inspired styling
* Lightweight overlay architecture
* Seamless workspace integration

### Open Source

* Fully open source
* No tracking
* No analytics
* No account required

## Screenshots

*Add screenshots here.*

## Supported Platforms

| Platform       | Supported |
| -------------- | --------- |
| Chrome         | ✅         |
| Microsoft Edge | ✅         |
| Safari (iPad)  | ✅         |
| Safari (macOS) | Planned   |
| Firefox        | Planned   |

## Technology

* React
* TypeScript
* Vite
* Tailwind CSS
* Safari Web Extensions
* Chrome Manifest V3

## Development

Install dependencies:

```bash
npm install
```

Run a build:

```bash
npm run build
```

Build Safari version:

```bash
npm run safari:build
```

Sync updated extension assets into the Safari project:

```bash
npm run safari:sync
```

## Project Structure

```txt
public/
├─ manifest.json
├─ onshape-page-bridge.js

src/
├─ components/
├─ hooks/
├─ services/
├─ styles/
├─ core/
└─ main.tsx

apps/
└─ safari/
```

## Privacy

Onshape Plus does not collect, store, transmit, or sell user data.

## Disclaimer

Onshape Plus is an independent third-party project and is not affiliated with, endorsed by, or sponsored by Onshape.

## Contributing

Issues, feature requests, and pull requests are welcome.

## License

This project is licensed under the terms of the repository license.
