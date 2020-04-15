# purgecss-loader

[![npm version](https://badge.fury.io/js/%40americanexpress%2Fpurgecss-loader.svg)](https://badge.fury.io/js/%40americanexpress%2Fpurgecss-loader)
[![Build Status](https://travis-ci.org/americanexpress/purgecss-loader.svg?branch=master)](https://travis-ci.org/americanexpress/purgecss-loader)

> Purgecss loader for webpack

This [Webpack](https://github.com/webpack/webpack) loader uses [purgecss](https://github.com/FullHuman/purgecss)
to strip unused selectors from your CSS.

> Want to get paid for your contributions to `purgecss-loader`?
> Send your resume to oneamex.careers@aexp.com

## Installation

```
npm install -D @americanexpress/purgecss-loader
```

## Usage

Configure as follows:

```js
module.exports = {
  entry: {...},
  output: {...},
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: '@americanexpress/purgecss-loader',
            options: {
              paths: [path.join(somePath, 'src/**/*.{js,jsx}')],
              whitelistPatternsChildren: [/:global$/],
            },
          },
        ],
      },
    ],
  },
}
```

You should use this with the [`css-loader`](https://github.com/webpack-contrib/css-loader)
as seen above. However, it is not required that you use CSS modules. That is in
the example to express this loader's compatibility.

## Options

| Property        | Description                       | Required |
|-----------------|-----------------------------------|----------|
| `paths`         | An array of file [glob] patterns  | `true`   |
| `extractors` | An array of [purgecss extractors] | `false`  |
| `fontFace`   | `boolean` (default: false) see [options]     | `false`  |
| `keyframes`  | `boolean` (default: false) see [options] | `false`  |
| `variables`  | `boolean` (default: false) see [options] | `false`  |
| `whitelist`  | `string[]` see [options]| `false`  |
| `whitelistPatterns` | `Array<RegExp>` see [options] | `false`  |
| `whitelistPatternsChildren` | `Array<RegExp>` see [options] | `false`  |

[glob]: https://github.com/isaacs/node-glob
[purgecss extractors]: https://www.purgecss.com/extractors.html
[options]: https://purgecss.com/configuration.html#options

## Contributing
We welcome Your interest in the American Express Open Source Community on Github.
Any Contributor to any Open Source Project managed by the American Express Open
Source Community must accept and sign an Agreement indicating agreement to the
terms below. Except for the rights granted in this Agreement to American Express
and to recipients of software distributed by American Express, You reserve all
right, title, and interest, if any, in and to Your Contributions. Please [fill
out the Agreement](https://cla-assistant.io/americanexpress/purgecss-loader).

Please feel free to open pull requests and see [CONTRIBUTING.md](./CONTRIBUTING.md)
for commit formatting details.

## License
Any contributions made under this project will be governed by the
[Apache License 2.0](./LICENSE.txt).

## Code of Conduct
This project adheres to the [American Express Community Guidelines](./CODE_OF_CONDUCT.md).
By participating, you are expected to honor these guidelines.
