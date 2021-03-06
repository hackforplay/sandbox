import { log } from '@hackforplay/log';
import { createElement } from 'react';
import { render } from 'react-dom';
import { filter, first } from 'rxjs/operators';
import { App } from './components/App';
import { message$, sendMessage } from './connector';
import { patchForEnchantJs } from './patch-for-enchant-js';
import './runtime';
import * as sandboxApi from './sandbox-api';
import { trackTime } from './utils';

const { requirejs, define } = require('./require');

requirejs.config({
  waitSeconds: 20
});

// game などを読み込めるようにする
(window as any)['feeles'] = sandboxApi; // 互換性保持のため
define('sandbox-api', function (require: any, exports: any, module: any) {
  module.exports = sandboxApi;
});

const defineCode = (moduleName: string, text: string) => {
  try {
    if (
      text.indexOf('define(function') === 0 || // AMD
      text.indexOf('(function(root, factory)') === 0 // UMD
    ) {
      // すでに AMD になっている
      eval(text);
      return;
    }

    // Unicode エスケープ文字がある場合, Babel が \u を \\u にしてしまうので, ここで直す
    let code = text.replace(/\\u(\w{4})/g, (match, hex) => {
      // e.g. hex === '7D2B'
      const charCode = parseInt(hex, 16);
      return String.fromCharCode(charCode);
    });
    // JavaScript を AMD として define
    if (moduleName.startsWith('modules/')) {
      const name = moduleName.split('/').reverse()[0];
      code = `window.__sandbox_context_name = '${name}';\n` + code;
    }
    // 実行時エラーを吸収する
    code = `try {
  ${code}
} catch (e) {
  console.error(e);
  log && log('error', e && e.message || e, '${moduleName}.js');
}`;
    define(moduleName, new Function('require, exports, module', code));
  } catch (error) {
    console.error(error);
    define(moduleName, new Function('require, exports, module', '')); // 無視して空のモジュールを登録
  }
};

// module resolver by feeles
const resolveFromIde = (moduleName: string) =>
  sendMessage('resolve', moduleName).then(({ data }) => {
    const { error, value } = data;
    if (error || typeof value !== 'string') {
      console.error(moduleName + ' is not found');
      // JavaScript を AMD として define
      define(moduleName, new Function('require, exports, module', '')); // 無視して空のモジュールを登録
      return;
    }
    defineCode(moduleName, value);
  });

// Override require()
requirejs.load = (context: any, moduleName: string) => {
  resolveFromIde(moduleName)
    .then(() => {
      context.completeLoad(moduleName);
    })
    .catch(error => {
      log('error', error.message, `require('${moduleName}')`);
    });
};

const entryPointIsReady = message$
  .pipe(
    filter(event => event.data && event.data.query === 'entry'),
    first()
  )
  .toPromise()
  .then(event => {
    const value = event.data && event.data.value;
    if (!Array.isArray(value)) {
      throw Error('error: invalid entry point');
    }
    for (const item of value) {
      defineCode(item.name, item.code);
    }
    return value.map(item => item.name);
  });

const appRoot = document.getElementById('app');
const domReady = new Promise(resolve => {
  render(createElement(App), appRoot, resolve);
});

Promise.all([entryPointIsReady, sandboxApi.audioContextReady, domReady]).then(
  ([entryPoints]) => {
    trackTime('require_js', 'start');
    requirejs(entryPoints, () => {
      const enchant = (window as any).enchant;
      if (enchant) {
        patchForEnchantJs(enchant);
      }
      trackTime('require_js', 'end');
    });
  }
);

// Load feeles/kana.json as default kana
sandboxApi.fetchText &&
  sandboxApi
    .fetchText('feeles/kana.json')
    .then(json => {
      try {
        const kana = JSON.parse(json);
        if (typeof kana.members === 'object') {
          sandboxApi.kana$.next(kana);
        }
      } catch (error) {}
    })
    .catch(() => {});

trackTime('entry_point', 'start');
entryPointIsReady.then(() => trackTime('entry_point', 'end'));
trackTime('dom_ready', 'start');
domReady.then(() => trackTime('dom_ready', 'end'));
