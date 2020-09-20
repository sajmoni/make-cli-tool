<h1 align="center">
  {{ toolName }}
</h1>
<h4 align="center">
    A CLI tool
</h4>

<div align="center">
  <img src="https://badgen.net/npm/v/{{ toolName }}?icon=npm" />
  <!-- <img src="https://badgen.net/github/last-commit/<your user name>/{{ toolName }}?icon=github" /> -->
</div>

Add a short introduction here.

---

## :sparkles: Features

---

## :wrench: Usage

```
npx {{ toolName }}
```

_Usage with `npx` ensures that you are always using the latest version_

---

## :book: Recipes

---

## :computer: Develop

### Commands

| Command        | Description                                    |
| -------------- | ---------------------------------------------- |
| `yarn start`   | Continuously builds and runs the tool          |
| `yarn build`   | Generate files in the `dist` folder            |
| `yarn release` | Start the process to release a new version     |
| `yarn tsc`     | Run a type check with `typescript`             |
| `yarn xo`      | Lint with `xo`                                 |
| `yarn clean`   | Remove build artefact (`.tgz` file)            |
| `yarn go`      | Builds, packs and installs to `example` folder |

### Workflow

1. Make changes
2. `yarn go` and verify that your changes work.
3. Commit to `master` or make `PR`

#### Release

1. `yarn release:prepare` - Sets up your library for release
2. If everything worked in the previous step: `yarn release`
