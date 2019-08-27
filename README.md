# nwjs-vue

> A NW.js & Vue.js quick start boilerplate.

### Getting Started

#### Installation

Install boilerplate:

``` bash
npm install -g @vue/cli @vue/cli-init
vue init elegantweb/nwjs-vue <project name>
```

Install dependencies:

``` bash
cd <project name>
npm install
```

#### Development

Specify target NW.js version in `package.json`:

You can find available options [here](https://github.com/evshiron/nwjs-builder-phoenix).

```
{
  [...]
  "build": {
    [...]
    "nwVersion": "0.40.1",
    [...]
  },
  [...]
}
```

Run NW.js application for development:

``` bash
npm run dev
```

#### Production

Specify target platforms and architectures in `package.json`:

You can find available options [here](https://github.com/evshiron/nwjs-builder-phoenix).

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
