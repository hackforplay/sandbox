import { sendMessage } from './connector';
import './runtime';
import * as sandboxApi from './sandbox-api';
import { render } from 'react-dom';
import { createElement } from 'react';
import { App } from './components/app';
import { patchForEnchantJs } from './patch-for-enchant-js';

const { requirejs, define } = require('./require');

requirejs.config({
  waitSeconds: 10
});

// game などを読み込めるようにする
(window as any)['feeles'] = sandboxApi; // 互換性保持のため
define('sandbox-api', function(require: any, exports: any, module: any) {
  module.exports = sandboxApi;
});

// module resolver by feeles
const resolveFromIde = (moduleName: string) =>
  sendMessage('resolve', moduleName).then(({ data }) => {
    if (data.error) {
      console.error(moduleName + ' is not found');
      // JavaScript を AMD として define
      define(moduleName, new Function('require, exports, module', '')); // 無視して空のモジュールを登録
      return;
    }

    const text: string = data.value;
    if (
      text.indexOf('define(function') === 0 || // AMD
      text.indexOf('(function(root, factory)') === 0 // UMD
    ) {
      // すでに AMD になっている
      eval(text);
      return;
    }

    // Unicode エスケープ文字がある場合, Babel が \u を \\u にしてしまうので, ここで直す
    const code = text.replace(/\\u(\w{4})/g, (match, hex) => {
      // e.g. hex === '7D2B'
      const charCode = parseInt(hex, 16);
      return String.fromCharCode(charCode);
    });
    // JavaScript を AMD として define
    define(moduleName, new Function('require, exports, module', code));
  });

// Override require()
requirejs.load = (context: any, moduleName: string) => {
  resolveFromIde(moduleName).then(() => {
    context.completeLoad(moduleName);
  });
};

const mainJsReady = resolveFromIde('main');

const appRoot = document.getElementById('app');
const appReady = new Promise(resolve =>
  render(createElement(App), appRoot, resolve)
);

Promise.all([mainJsReady, appReady]).then(() => {
  requirejs(['main'], () => {
    const enchant = (window as any).enchant;
    if (enchant) {
      patchForEnchantJs(enchant);
    }
  });
});
