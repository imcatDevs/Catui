# IMCAT UI

**Lightweight, Zero-Build, ES6+ JavaScript Web Framework**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.1.2-green.svg)](https://github.com/imcatDevs/imcat_ui)
[![npm](https://img.shields.io/npm/v/@imcat-ckim/catui.svg)](https://www.npmjs.com/package/@imcat-ckim/catui)

> **[한국어](README.md)** | English

---

## Features

- **Zero Build** — No Webpack, Vite, or bundler required
- **Lightweight** — Core < 15KB (gzipped)
- **Dynamic Module Loading** — Load only what you need via `IMCAT.use()`
- **SPA Routing** — Built-in router with `catui-href` attribute
- **Security First** — Automatic XSS defense (`Security.escape()`, `Security.sanitize()`)
- **Pure ES6+** — No TypeScript compilation needed
- **22 UI Modules** — Overlay, Dropdown, Tooltip, Chart, Gantt, and more

---

## Installation

### CDN (unpkg)

```html
<link rel="stylesheet" href="https://unpkg.com/@imcat-ckim/catui@1.1.2/dist/imcat-ui.css">
<script src="https://unpkg.com/@imcat-ckim/catui@1.1.2/dist/imcat-ui.js"></script>
```

### CDN (jsDelivr)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@imcat-ckim/catui@1.1.2/dist/imcat-ui.css">
<script src="https://cdn.jsdelivr.net/npm/@imcat-ckim/catui@1.1.2/dist/imcat-ui.js"></script>
```

### NPM

```bash
npm install @imcat-ckim/catui
# or
pnpm add @imcat-ckim/catui
```

### ESM Import

```javascript
import IMCAT from '@imcat-ckim/catui';
```

---

## Quick Start

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>IMCAT UI</title>
  <link rel="stylesheet" href="./dist/imcat-ui.css">
</head>
<body>
  <div id="app">
    <button id="btn" class="btn btn--primary">Click Me</button>
  </div>

  <script src="./dist/imcat-ui.js"></script>
  <script>
    // DOM manipulation (jQuery-like syntax)
    IMCAT('#btn').on('click', async () => {
      // Dynamic module loading
      const Overlay = await IMCAT.use('overlays');
      Overlay.Modal.show('Hello', 'Welcome to IMCAT UI!');
    });
  </script>
</body>
</html>
```

---

## Core API

| Module | Description |
| ------ | ----------- |
| **DOM** | jQuery-style DOM manipulation with chaining and auto XSS defense |
| **Router** | SPA routing with `catui-href` attribute-based navigation |
| **Events** | Global EventBus + per-component EventEmitterMixin |
| **State** | Proxy-based reactive state management |
| **Storage** | localStorage/sessionStorage wrapper with TTL support |
| **Template** | Mustache-like template engine with auto-escaping |
| **Formatters** | Number, date, currency, phone formatting |
| **API** | HTTP client (fetch wrapper with interceptors) |
| **Config** | Global settings, per-component defaults |
| **Security** | XSS defense, path validation, HTML sanitization |

## Extension Modules (22)

Load on demand with `IMCAT.use('moduleName')`:

| Module | Components |
| ------ | ---------- |
| **overlays** | Modal, Drawer, Offcanvas |
| **dropdown** | Dropdown |
| **tooltips** | Tooltip, Popover |
| **navigation** | Tabs, Accordion, Collapse, MegaMenu, TreeView, Sidebar |
| **feedback** | Toast, Notification, ProgressTracker, Skeleton |
| **carousel** | Carousel, Lightbox |
| **pickers** | DatePicker, TimePicker, ColorPicker, Countdown, DDay |
| **selectors** | Autocomplete, MultiSelect, RangeSlider |
| **forms** | FileUpload, Rating, SignaturePad, FormWizard |
| **data-viz** | DataTable, Chart, Masonry, Kanban, Calendar |
| **stepper** | Stepper, VerticalStepper |
| **scroll** | VirtualScroll, Scrollspy, InfiniteScroll, SmoothScroll, BackToTop |
| **pagination** | Pagination |
| **theme** | Theme, createTheme, initTheme |
| **advanced-ui** | SplitPane, QRCode, CopyToClipboard, CodeBlock, SimpleColorPicker |
| **social** | ChatUI, Comments, Reactions, SocialFeed, ShareButtons |
| **imagelist** | ImageList, ImageLightbox, ImageCompare, LazyImage |
| **gantt** | Gantt |
| **live-status** | OnlineStatus, TypingIndicator, ActivityStatus, LiveCounter, ConnectionStatus |
| **security-input** | OTPInput, PinInput |
| **text-editors** | RichTextEditor, MarkdownEditor, TextareaAutosize |
| **media-viewer** | VideoPlayer, AudioPlayer, ImageViewer, EmbedVideo |

---

## Build Outputs

| File | Format | Description |
| ---- | ------ | ----------- |
| `dist/imcat-ui.js` | IIFE | Global `IMCAT` object |
| `dist/imcat-ui.min.js` | IIFE | Minified |
| `dist/imcat-ui.esm.js` | ESM | ES module bundle |
| `dist/modules/*.js` | ESM | Individual modules (for dynamic loading) |
| `dist/imcat-ui.css` | CSS | Core styles |
| `dist/imcat-ui.all.css` | CSS | Core + all module styles |
| `dist/modules/*.css` | CSS | Per-module styles (auto-loaded) |

---

## Development

### Setup

```bash
git clone https://github.com/imcatDevs/Catui.git
cd Catui
pnpm install
```

### Dev Server

```bash
pnpm run dev     # Rollup watch mode
pnpm run serve   # HTTP server on port 3000
```

### Build

```bash
pnpm run build
```

### Test

```bash
pnpm exec vitest run            # Run tests
pnpm run test:coverage          # Coverage report
```

### Lint

```bash
pnpm run lint
pnpm run lint:fix
```

---

## Project Structure

```text
imcat-ui/
├── src/
│   ├── core/       # Core framework (20 modules)
│   ├── modules/    # Extension UI components (22 modules)
│   ├── styles/     # SCSS style system
│   └── fonts/      # Built-in fonts
├── dist/           # Build output
├── tests/          # Vitest unit tests
├── docs/           # Documentation
├── examples/       # Demo site
└── types/          # TypeScript declarations
```

---

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

[MIT License](./LICENSE) — free to use, modify, and distribute.

---

## Links

- **Homepage**: [imcat.dev](https://imcat.dev)
- **Demo**: [catui.imcat.dev](https://catui.imcat.dev)
- **npm**: [@imcat-ckim/catui](https://www.npmjs.com/package/@imcat-ckim/catui)
- **Issues**: [GitHub Issues](https://github.com/imcatDevs/Catui/issues)

---

**IMCAT UI** — Build faster, lighter, safer web applications.
