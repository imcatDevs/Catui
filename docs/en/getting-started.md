# Getting Started

A guide to installing IMCAT UI and building your first page.

> **Source**: `dist/` folder | **Live Demo**: [catui.imcat.dev](https://catui.imcat.dev/)
>
> **Key takeaway**: Download ZIP or install via npm, load CSS/JS, then use shortcut APIs like `IMCAT.alert()`.
> Place `dist/imcat-ui.css` in `<head>` and `dist/imcat-ui.min.js` before `</body>`.

---

## Installation

### 1. ZIP Download (Fastest)

Download the latest release — includes JS + CSS + fonts (~400KB).

Extract and copy the `dist/` folder to your project root.

### 2. npm Install

```bash
# npm
npm install @imcat-ckim/catui

# pnpm
pnpm add @imcat-ckim/catui
```

### 3. ESM Import (Bundler)

```javascript
import IMCAT from '@imcat-ckim/catui';
```

### 4. CDN

```html
<!-- unpkg -->
<link rel="stylesheet" href="https://unpkg.com/@imcat-ckim/catui@1.1.2/dist/imcat-ui.css">
<script src="https://unpkg.com/@imcat-ckim/catui@1.1.2/dist/imcat-ui.js"></script>

<!-- jsDelivr -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@imcat-ckim/catui@1.1.2/dist/imcat-ui.css">
<script src="https://cdn.jsdelivr.net/npm/@imcat-ckim/catui@1.1.2/dist/imcat-ui.js"></script>
```

---

## Boilerplate

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <link rel="stylesheet" href="./dist/imcat-ui.css">
</head>
<body>
  <div id="app">
    <h1>Hello IMCAT UI</h1>
    <button id="btn" class="btn btn--primary">Open Modal</button>
  </div>

  <script src="./dist/imcat-ui.min.js"></script>
  <script>
    IMCAT('#btn').on('click', async () => {
      const Overlay = await IMCAT.use('overlays');
      Overlay.Modal.show('Welcome', 'IMCAT UI is ready!');
    });
  </script>
</body>
</html>
```

---

## Core Concepts

### DOM Manipulation

jQuery-like syntax with automatic XSS protection:

```javascript
// Select and manipulate
IMCAT('#title').html('<b>Safe HTML</b>');  // Auto-escaped
IMCAT('.items').addClass('active');
IMCAT('#input').val();                     // Get value

// Event binding
IMCAT('#btn').on('click', (e) => { /* ... */ });

// Chaining
IMCAT('#box').addClass('highlight').css('color', 'red').show();
```

### Dynamic Module Loading

Load modules on demand — only the core (~15KB) loads initially:

```javascript
// Load a module
const Overlay = await IMCAT.use('overlays');
const Chart = await IMCAT.use('data-viz');

// Load a sub-module
const Modal = await IMCAT.use('overlays/Modal');

// Modules are cached after first load
const Overlay2 = await IMCAT.use('overlays'); // Instant (from cache)
```

### SPA Routing

Attribute-based navigation without page reloads:

```html
<!-- Navigation -->
<nav>
  <a catui-href="/home">Home</a>
  <a catui-href="/about">About</a>
  <a catui-href="/contact">Contact</a>
</nav>

<!-- View container -->
<div catui-target="main"></div>
```

```javascript
// Programmatic navigation
IMCAT.router.navigate('/home');

// Route change listener
IMCAT.router.on('afterChange', (route) => {
  console.log('Navigated to:', route.path);
});
```

### Template Engine

Mustache-like templates with auto-escaping:

```javascript
// Auto-escaped (safe)
const html = IMCAT.template.render(
  '<p>Hello, {{name}}!</p>',
  { name: userInput }  // XSS payloads are escaped
);

// Raw rendering (trusted content only!)
const raw = IMCAT.template.renderRaw(
  '<div>{{content}}</div>',
  { content: serverRenderedHTML }
);
```

### State Management

Proxy-based reactive state:

```javascript
const state = IMCAT.state.create({
  count: 0,
  items: []
});

// Watch for changes
state.$watch('count', (newVal, oldVal) => {
  IMCAT('#counter').text(newVal);
});

// Update triggers watchers automatically
state.count++;
```

---

## Shortcut API

Frequently used operations are available directly on the `IMCAT` object:

```javascript
// Alerts
IMCAT.alert('Title', 'Message');
IMCAT.confirm('Delete?', 'Are you sure?').then(ok => { /* ... */ });
IMCAT.toast('Saved successfully', 'success');

// Utilities
IMCAT.utils.debounce(fn, 300);
IMCAT.utils.throttle(fn, 100);
IMCAT.utils.randomId('prefix');

// Security
IMCAT.security.escape(userInput);
IMCAT.security.sanitize(htmlString);

// Formatting
IMCAT.formatters.number(1234567);     // "1,234,567"
IMCAT.formatters.currency(9900);      // "₩9,900"
IMCAT.formatters.date(new Date());    // "2025-01-01"
```

---

## What's Next?

- **[Performance Guide](../performance/optimization-guide.md)** — High-load optimization
- **[Security Guide](../security/csp-guide.md)** — CSP headers, token storage
- **[API Docs (JSDoc)](../jsdoc/index.html)** — Full API reference

---

## Related Documentation

> Note: Detailed documentation is currently available in Korean.
> English translations are in progress.

- [Full Documentation Index (Korean)](../README.md)
- [Cheatsheet (Korean)](../CHEATSHEET.md)
- [Implementation Patterns (Korean)](../PATTERNS.md)
