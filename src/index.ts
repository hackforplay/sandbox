import './runtime';

const div = document.createElement('div');
// div.textContent = "Hello Sandbox!";

const value = sessionStorage.getItem('value') + '~';
div.textContent = value;
sessionStorage.setItem('value', value);

document.body.appendChild(div);

const { requirejs, define } = require('./require');

define('hogehoge', function(require: any, exports: any, module: any) {
  module.exports = 'hogehoge';
});

define('main', function(require: any, exports: any, module: any) {
  const hogehoge = require('hogehoge');
  console.log(hogehoge);
  module.exports = hogehoge + 'fugafuga';
});

requirejs(['main'], (main: any) => console.log('main', main));
