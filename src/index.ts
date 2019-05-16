import { first, map } from 'rxjs/operators';
import { sendMessage } from './connector';
import './runtime';
import * as sandboxApi from './sandbox-api';

const div = document.createElement('div');
// div.textContent = "Hello Sandbox!";

const value = sessionStorage.getItem('value') + '~';
div.textContent = value;
sessionStorage.setItem('value', value);

document.body.appendChild(div);

const { requirejs, define } = require('./require');

// game などを読み込めるようにする
(window as any)['feeles'] = sandboxApi; // 互換性保持のため
define('sandbox-api', function(require: any, exports: any, module: any) {
  module.exports = sandboxApi;
});

// module resolver by feeles
const requireFromIde = (moduleName: string) =>
  sendMessage('resolve', moduleName).pipe(
    first(),
    map(e => e.data),
    map(data => {
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
    })
  );

// Override require()
requirejs.load = (context: any, moduleName: string) => {
  console.log('load', context, moduleName);
  requireFromIde(moduleName).subscribe(() => {
    console.log('loaded', moduleName);
    context.completeLoad(moduleName);
  });
};

requireFromIde('main').subscribe(() => {
  requirejs(['main'], () => {
    console.log('main is started');
  });
});

