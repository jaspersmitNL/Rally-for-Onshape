# Onshape Plus

Make Onshape faster, cleaner, and easier to use.

Onshape Plus is an open-source browser extension that enhances the Onshape experience with thoughtful UI improvements, touch and pen optimizations, productivity tools, and quality-of-life features designed for both tablet and desktop workflows.

Whether you're using a mouse, trackpad, touchscreen, or stylus, Onshape Plus helps reduce friction and streamline common modeling tasks while preserving the workflows you already know.

Available for Chrome, Microsoft Edge, and Safari on iPad.

---

## Trusted & Transparent

* ✅ Open Source
* ✅ Public GitHub Releases
* ✅ No Analytics
* ✅ No Telemetry
* ✅ No External Data Collection
* ✅ No Account Required

Learn more:

* [Security Policy](./SECURITY.md)
* [Security Overview](./docs/security-overview.md)
* [Build & Verify Guide](./docs/build-and-verify.md)

---

## Why Onshape Plus?

Onshape is a powerful CAD platform. Onshape Plus builds on that foundation by adding optional enhancements that improve accessibility, efficiency, and usability without requiring changes to your existing workflow.

Features are designed to feel native to Onshape and integrate seamlessly into the existing interface.

---

## Installation

### Chrome

Install from the Chrome Web Store:

https://chromewebstore.google.com/detail/onshape-plus/hanbmgaepnkkmmgafdpfocnjhfccckoh

### Microsoft Edge

Install from the Chrome Web Store or load the extension manually.

### Safari (iPad)

Available on the App Store.

---

## Features

### Touch & Pen Optimized

Designed to improve the experience on tablets and touch-enabled devices.

* Touch-friendly interface enhancements
* Quick-access floating toolbar
* Improved stylus and pen workflows
* Faster access to common modeling actions
* Optimized tablet navigation and interaction patterns

### Productivity Enhancements

Reduce repetitive actions and keep common tools within reach.

* Floating numeric keypad for dimension entry
* Quick access to frequently used commands
* Dynamic command layouts
* Context-aware actions
* Persistent UI positioning and preferences

### Seamless Integration

Built to complement Onshape rather than replace it.

* Native-feeling interface additions
* Dark mode support
* Lightweight overlay architecture
* Minimal visual disruption
* Consistent Onshape-inspired styling

### Open Source

Onshape Plus is developed in the open and available for anyone to inspect, audit, and contribute to.

* Fully open source
* No tracking
* No analytics
* No account required
* Community-driven development

---

## Screenshots

*Screenshots and feature demonstrations coming soon.*

---

## Supported Platforms

| Platform       | Status         |
| -------------- | -------------- |
| Chrome         | ✅ Supported    |
| Microsoft Edge | ✅ Supported    |
| Safari (iPad)  | ✅ Supported    |
| Firefox        | 🚧 In Progress |
| Safari (macOS) | 📋 Planned     |

---

## Security & Privacy

Onshape Plus is designed to operate locally within your browser.

* No telemetry
* No analytics
* No advertising
* No external data collection
* No account required

The extension stores only local user preferences using browser extension storage.

### Security Documentation

For organizations evaluating Onshape Plus, the following documentation is available:

* [Security Policy](./SECURITY.md)
* [Security Overview](./docs/security-overview.md)
* [Build & Verify Guide](./docs/build-and-verify.md)

Every published release corresponds to a public GitHub release tag, allowing organizations to review, build, and verify the source code associated with a specific version.

---

## Technology

Built with:

* React
* TypeScript
* Vite
* Tailwind CSS
* Chrome Manifest V3
* Safari Web Extensions

---

## Development

### Install Dependencies

```bash
npm install
```

### Build

```bash
npm run build
```

### Build Safari Version

```bash
npm run safari:build
```

### Sync Safari Assets

```bash
npm run safari:sync
```

---

## Project Structure

```text
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

---

## Contributing

Bug reports, feature requests, discussions, and pull requests are always welcome.

If you have ideas for improving tablet workflows, touch interactions, accessibility, or productivity within Onshape, we'd love to hear from you.

---

## Disclaimer

Onshape Plus is an independent community project and is not affiliated with, endorsed by, or sponsored by Onshape or PTC.

All trademarks are the property of their respective owners.

---

## License

Licensed under the MIT License.
