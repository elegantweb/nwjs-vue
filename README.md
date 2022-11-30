# nwjs-vue

> A clean NW.js & Vue.js quick start boilerplate.

## Installation

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

## Getting Started

### Development

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

### Production

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


## Alternatives

* [NW Vue 3 Boilerplate](https://github.com/nwutils/nw-vue3-boilerplate) - NW.js + Vue 3 + Vite + Vitest + Vue-DevTools + Pinia
* [nw-vue-cli-example](https://github.com/nwutils/nw-vue-cli-example) - Uses Vue-CLI, has Vue 2 and Vue 3 branches.
* [vue-desktop-basic](https://github.com/TheJaredWilcurt/vue-desktop-basic) - Does not use a build system at all, all `.vue` files run directly in the browser context
