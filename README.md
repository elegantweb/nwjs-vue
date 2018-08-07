# nwjs-vue

> A NW.js & Vue.js quick start boilerplate

## Getting Started

### Installation

Install vue-cli and scaffold boilerplate:

``` bash
npm install -g vue-cli
vue init elegantweb/nwjs-vue <project name>
```

Install dependencies:

``` bash
cd <project name>
npm install
```

### Development

Specify target NW.js version in your `app/package.json`:
Find available options [here](https://github.com/evshiron/nwjs-builder-phoenix).

```
{
  [...]
  "build": {
    [...]
    "nwVersion": "0.32.1",
    [...]
  },
  [...]
}
```

Run NW.js application for development:

``` bash
npm run dev
```

### Production

Specify target platforms and architectures in your `app/package.json`:

```
{
  [...]
  "build": {
    [...]
    "nwPlatforms": ["win"],
    "nwArchs": ["x64"],
    [...]
  },
  [...]
}
```

Build NW.js application for production:

``` bash
npm run build
```
