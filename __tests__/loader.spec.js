/*
 * Copyright (c) 2018 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

const path = require('path');
const webpack = require('webpack');
const MemoryFs = require('memory-fs');
const findIndex = require('lodash/findIndex');

const crypto = require('crypto');

// Monkey Patch for unsupported hash algo. Needed to support Node >=17.
// https://github.com/webpack/webpack/issues/13572#issuecomment-923736472
const originalCreateHash = crypto.createHash;
crypto.createHash = (algo) => originalCreateHash(algo === 'md4' ? 'sha256' : algo);

jest.setTimeout(10000);

const runLoader = (safelist,
  {
    entry = '../__fixtures__/Component.jsx',
  } = {}) => {
  const compiler = webpack({
    context: __dirname,
    entry,
    output: {
      path: path.resolve(__dirname),
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: [
                'babel-preset-env',
                'babel-preset-react',
              ],
            },
          }],
        },
        {
          test: /\.s?css$/,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            {
              loader: path.resolve(__dirname, '../loader.js'),
              options: {
                paths: [path.resolve(__dirname, '../__fixtures__/**/*.{js,jsx}')],
                safelist,
              },
            },
          ],
        },
      ],
    },
    externals: {
      react: {
        var: 'React',
        commonjs2: 'react',
      },
    },
  });

  compiler.outputFileSystem = new MemoryFs();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);

      resolve(stats);
    });
  });
};

describe('purgecss loader', () => {
  it('should strip unused classes', async () => {
    const stats = await runLoader();
    const { modules } = stats.toJson();
    const cssModuleIndex = findIndex(modules, {
      name: '../node_modules/css-loader??ref--5-1!../loader.js??ref--5-2!../__fixtures__/styles.css',
    });
    const output = modules[cssModuleIndex].source;
    expect(output).not.toContain('isNotUsed');
    expect(output).toContain('isUsed');
  });

  it('should not strip safelisted global classes', async () => {
    const componentEntry = { entry: '../__fixtures__/ComponentGlobal.jsx' };
    const stats = await runLoader([/:global$/], componentEntry);
    const { modules } = stats.toJson();
    const cssModuleIndex = findIndex(modules, {
      name: '../node_modules/css-loader??ref--5-1!../loader.js??ref--5-2!../__fixtures__/root.scss',
    });
    const output = modules[cssModuleIndex].source;
    expect(output).not.toContain('isNotUsed');
    expect(output).toContain('isUsed');
  });
});
