# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static website that tests Benford's Law against large, publicly available datasets. Hosted on Vercel at testingbenfordslaw.com. No build step required for basic development — it's a simple static site with jQuery, JSON data files, and pre-compiled CSS/JS.

## Architecture

- `index.html` — Single-page app, all UI lives here
- `js/app.js` — Main application logic (compiled from CoffeeScript), handles chart rendering, dataset loading, URL routing via pushState
- `js/coffee/app.coffee` — CoffeeScript source; **edit this, not `js/app.js`**
- `js/datasets/index.json` — Registry of all datasets (key = filename slug, value = display name)
- `js/datasets/*.json` — Individual dataset files with `values` (digit 1-9 percentages), `num_records`, `min_value`, `max_value`, `source`
- `css/sass/screen.scss` — Sass source; **edit this, not `css/screen.css`**
- `config.rb` — Compass configuration
- `now.json` — Vercel rewrite config (all routes → index.html for client-side routing)

## Development Commands

Compile CoffeeScript (watch mode):
```
coffee --watch -o js/ --compile js/coffee/*.coffee
```

Compile Sass (watch mode):
```
compass watch
```

Compile production CSS:
```
compass compile --output-style compressed --force
```

## Adding a Dataset

1. Add a key/value entry to `js/datasets/index.json`
2. Create a matching JSON file in `js/datasets/` with this structure:
```json
{
  "values": { "1": 30.1, "2": 17.6, ... "9": 4.6 },
  "num_records": "38,670,514",
  "min_value": "1",
  "max_value": "4,706,631",
  "source": "https://..."
}
```
Values are percentages of leading digit frequency (1-9). `num_records`, `min_value`, and `max_value` are formatted strings (with commas). `source` must be a URL.
