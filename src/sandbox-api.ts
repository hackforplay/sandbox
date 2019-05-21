import { BehaviorSubject } from 'rxjs';
import { connected as c, sendMessage } from './connector';

export const code$ = new BehaviorSubject('');
export const pause$ = new BehaviorSubject(false);

export const env: Feeles['env'] = { VERSION_UUID: '', USER_UUID: '' };
export const connected: Feeles['connected'] = c;
export const fetch: Feeles['fetch'] = name =>
  sendMessage('fetch', name).then(e => new Response(e.data.value));

export const fetchDataURL: Feeles['fetchDataURL'] = name =>
  sendMessage('fetchDataURL', name).then(e => e.data.value as string);

export const fetchText: Feeles['fetchText'] = name =>
  sendMessage('fetchText', name).then(e => e.data.value as string);

export const fetchArrayBuffer: Feeles['fetchArrayBuffer'] = () => {
  throw Error('nope');
};
export const resolve: Feeles['resolve'] = () => {
  throw Error('nope');
};
export const saveAs: Feeles['saveAs'] = () => {
  throw Error('nope');
};
export const reload: Feeles['reload'] = () => {
  throw Error('nope');
};
export const replace: Feeles['replace'] = url => sendMessage('replace', url);

export const openReadme: Feeles['openReadme'] = () => {
  throw Error('nope');
};
export const closeReadme: Feeles['closeReadme'] = () => {
  throw Error('nope');
};
export const openMedia: Feeles['openMedia'] = () => {
  throw Error('nope');
};
export const closeMedia: Feeles['closeMedia'] = () => {
  throw Error('nope');
};
export const openCode: Feeles['openCode'] = () => {
  throw Error('nope');
};
export const closeCode: Feeles['closeCode'] = () => {
  throw Error('nope');
};
export const openEditor: Feeles['openEditor'] = () => {
  throw Error('nope');
};
export const setAlias: Feeles['setAlias'] = () => Promise.resolve();

export const closeEditor: Feeles['closeEditor'] = () => {
  throw Error('nope');
};
export const runCode: Feeles['runCode'] = () => {
  throw Error('nope');
};
export const install: Feeles['install'] = name => sendMessage('install', name);

export const ipcRenderer: Feeles['ipcRenderer'] = null;

export const setTimeout: Feeles['setTimeout'] = window.setTimeout.bind(window);
export const clearTimeout: Feeles['clearTimeout'] = window.clearTimeout.bind(
  window
);
export const setInterval: Feeles['setInterval'] = window.setInterval.bind(
  window
);
export const clearInterval: Feeles['clearInterval'] = window.clearInterval.bind(
  window
);

// Feeles の onMessage を dispatch する
export const dispatchOnMessage: Feeles['dispatchOnMessage'] = () => {
  throw new Error('nope');
};
// 親ウィンドウで URL (Same Domain) を window.open する
export const openWindow: Feeles['openWindow'] = () => {
  throw new Error('nope');
};
// error を IDE に投げる
const cloneError = (error: Error) => {
  const keys = [
    'message',
    'name',
    'fileName',
    'lineNumber',
    'columnNumber',
    'stack'
  ];
  const clonable: { [index: string]: any } = {};
  for (const key of keys) {
    clonable[key] = (error as any)[key];
  }
  return clonable;
};
export const throwError: Feeles['throwError'] = error => {
  sendMessage('throwError', cloneError(error));
};

// eval する
const eval_: Feeles['eval'] = code => eval(code);
export { eval_ as eval }; // avoid no 'eval' in strict mode

export interface Feeles {
  code$: BehaviorSubject<string>;
  pause$: BehaviorSubject<boolean>;
  /**
   * Deprecated
   */
  env?: {
    USER_UUID: string;
    VERSION_UUID: string;
  };
  connected: Promise<{ port: MessagePort }>;
  fetch?: (name: string) => Promise<any>;
  fetchDataURL?: (name: string) => Promise<any>;
  fetchText?: (name: string) => Promise<any>;
  fetchArrayBuffer?: (name: string) => Promise<any>;
  resolve?: (name: string) => Promise<any>;
  saveAs?: (blob: Blob, name: string) => Promise<any>;
  reload?: () => Promise<any>;
  replace?: (url: string) => Promise<any>;
  openReadme?: (fileName: string) => Promise<any>;
  closeReadme?: () => Promise<any>;
  openMedia?: (params: any) => Promise<any>;
  closeMedia?: () => Promise<any>;
  openCode?: (fileName: string) => Promise<any>;
  closeCode?: () => Promise<any>;
  openEditor?: (fileName: string) => Promise<any>;
  closeEditor?: () => Promise<any>;
  /**
   * Deprecated
   */
  setAlias?: (name: string, ref: any) => Promise<any>;
  runCode?: () => Promise<any>;
  install?: (name: string) => Promise<any>;
  /**
   * Deprecated
   */
  ipcRenderer?: any;
  setTimeout?: (func: () => void, delay: number) => number;
  clearTimeout?: (timeoutId: number) => void;
  setInterval?: (func: () => void, delay: number) => number;
  clearInterval?: (intervalId: number) => void;
  // Feeles の onMessage を dispatch する
  dispatchOnMessage?: (data: any) => void;
  // 親ウィンドウで URL (Same Domain) を window.open する
  openWindow?: (
    url: string,
    target: string,
    features: any,
    replace: any
  ) => void;
  // error を IDE に投げる
  throwError?: (error: Error) => void;
  // eval する
  eval?: (code: string) => void;
}
