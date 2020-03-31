<h1 align="center">
  make-cli-tool
</h1>
<h4 align="center">
    A javascript library
</h4>

<div align="center">
  <img src="https://badgen.net/npm/v/make-cli-tool?icon=npm" />
  <img src="https://badgen.net/bundlephobia/minzip/make-cli-tool" />
</div>

Add a short introduction here.

---

## :sparkles: Features

---

## :wrench: Example usage

---

## :package: Install

**npm**

```
npm install make-cli-tool
```

**yarn**

```
yarn add make-cli-tool
```

---

## :newspaper: API

[getGreeting](docs/getGreeting.md) - Get a greeting

---

## :book: Recipes

---

## :computer: Develop

### Commands

Command | Description
------- | -----------
`yarn build` | Generate files in the `dist` folder
`yarn release` | Start the process to release a new version
`yarn typecheck` | Run a type check with `typescript`
`yarn lint` | Lint with `eslint`
`yarn clean` | Remove build artefact (`.tgz` file)
`yarn build-test` | Builds, packs and installs to `example` folder

### Workflow

1. Make changes
2. `yarn build-test` and verify that your changes work.
3. Commit to `master` or make `PR`

#### Release

1. `yarn release:prepare` - Sets up your library for release
2. If everything worked in the previous step: `yarn release`
