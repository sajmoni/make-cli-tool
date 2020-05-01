<h1 align="center">
  make-cli-tool
</h1>
<h4 align="center">
    A command line tool to create other command line tools (using Node.js)
</h4>

<div align="center">
  <img src="https://badgen.net/npm/v/make-cli-tool?icon=npm" />
  <img src="https://badgen.net/github/last-commit/sajmoni/make-cli-tool?icon=github" />
</div>

---

## :sparkles: Features

- :boat: [`yargs`](https://github.com/yargs/yargs) - Build cli tools

- :crayon: [`chalk`](https://github.com/chalk/chalk) - Colorize output

- :sushi: [`rollup`](https://github.com/rollup/rollup) - Next-generation ES module bundler

- :arrow_up: [`np`](https://github.com/sindresorhus/np) - A better `npm publish`

- :straight_ruler: [`ava`](https://github.com/avajs/ava) - Super simple test framework

- :policeman: [`xo`](https://github.com/xojs/xo) and [`tsc`](https://github.com/microsoft/TypeScript) - Ensure code quality

- :nail_care: [`prettier`](https://github.com/prettier/prettier) - Code formatter

- :no_entry_sign: :poop: [`lint-staged`](https://github.com/okonet/lint-staged) + :dog: [`husky`](https://github.com/typicode/husky) - Ensure code quality on each git commit and push

- :trophy: [`badgen`](https://github.com/badgen/badgen.net) - Readme badges

- Workflow to test your CLI tool locally before publishing

---

## :wrench: Usage

```
npx make-cli-tool <tool-name> [options]
```

_Usage with `npx` ensures that you are always using the latest version_

`make-cli-tool` will do the following:

- Create a new folder called `<tool-name>`
- Copy all template files to that folder
- Install the dependencies
- Make an initial commit

### Before you start

If you intend to publish this to `npm`, then you should check the availability of your name with [`npm-name-cli`](https://github.com/sindresorhus/npm-name-cli): `npx npm-name-cli <library-name>`

### Example usage

```
npx make-cli-tool my-tool
```

The output file structure will look like this:

```
my-tool
├── .gitignore
├── .npmrc
├── build-test.sh
├── lint-staged.config.js
├── package.json
├── README.md
├── rollup.config.js
├── tsconfig.json
├── yarn.lock
├── node_modules/
├── example/
│   └── package.json
└── src/
    ├── index.js
    └── index.test.js
```

### Options

`--use-ink` (TODO)

Include [`ink`](). `ink` is a way to write command line output using the popular web framework [`react`]()

`--verbose` (TODO)

Display full output. Useful when debugging.

---

## What to do after the script is run

- Add a license: https://help.github.com/en/github/building-a-strong-community/adding-a-license-to-a-repository

- Update the repository field in package.json:

```json
"repository": {
  "type": "git",
  "url": "git+https://github.com/sajmoni/make-cli-tool.git"
},
```

_This is required for `np` to be able to publish a changelog_

- Set your repository URL

### You might also want to

- Update the `keywords` section in `package.json`, this helps people find your package on `npm`.

- Add or remove badges: https://badgen.net/

---

## Things you might want to do if your library becomes popular

### Documentation

If you need more advanced documentation, including a blog and translations, one good option is [`docosaurus`](https://github.com/facebook/docusaurus).

### Add GitHub issue and PR templates

https://help.github.com/en/github/building-a-strong-community/about-issue-and-pull-request-templates

---

## :computer: Develop

### Commands

| Command        | Description                                    |
| -------------- | ---------------------------------------------- |
| `yarn build`   | Generate files in the `dist` folder            |
| `yarn release` | Start the process to release a new version     |
| `yarn qa`      | Run type check with `tsc` and lint with `xo`   |
| `yarn clean`   | Remove build artefact (`.tgz` file)            |
| `yarn go`      | Builds, packs and installs to `example` folder |

### Workflow

1. Make changes
2. `yarn build-test` and verify that your changes work.
3. Commit to `master` or make `PR`

#### Release

1. `yarn release:prepare` - Sets up your library for release
2. If everything worked in the previous step: `yarn release`
