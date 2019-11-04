import { log } from '@hackforplay/log';
import { BehaviorSubject, fromEvent, merge } from 'rxjs';
import { internalHowToPlayDispatcher } from './components/gesture-view';
import { internalEmphasizeDispatcher } from './components/right';
import { connected as c, sendMessage } from './connector';

export const code$ = new BehaviorSubject('');
export const pause$ = new BehaviorSubject(!document.hasFocus());

export interface IButtonInput {
  up: boolean;
  right: boolean;
  down: boolean;
  left: boolean;
  a: boolean;
}
export const input$ = new BehaviorSubject<IButtonInput>({
  up: false,
  right: false,
  down: false,
  left: false,
  a: false
});

export const env: Feeles['env'] = { VERSION_UUID: '', USER_UUID: '' };
export const connected: Feeles['connected'] = c;
export const emphasizeCode: Feeles['emphasizeCode'] = internalEmphasizeDispatcher;
export const showHowToPlay: Feeles['showHowToPlay'] = internalHowToPlayDispatcher;

export interface KanaConfig {
  members: {
    [memberName: string]: string;
  };
}

export const kana$ = new BehaviorSubject<KanaConfig>({ members: {} });

export const audioContextReady: Feeles['audioContextReady'] = new Promise(
  resolve => {
    const { AudioContext, webkitAudioContext } = window as any;
    const context: AudioContext = new (AudioContext || webkitAudioContext)();
    if (context.state === 'running') {
      return resolve(context);
    }
    // wait for use action
    const subscription = merge(
      fromEvent(window, 'touchend'),
      fromEvent(window, 'mouseup'),
      fromEvent(window, 'keyup')
    ).subscribe(() => {
      // for iOS
      const buffer = context.createBuffer(1, 1, context.sampleRate);
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);
      // resume
      if (context.resume) {
        context.resume().then(() => {
          if (context.state === 'running') {
            resolve(context);
            subscription.unsubscribe();
          }
        });
      } else {
        if (context.state === 'running') {
          resolve(context);
          subscription.unsubscribe();
        }
      }
    });
  }
);

const nope = () => {};

export const fetch: Feeles['fetch'] = name =>
  sendMessage('fetch', name).then(e => new Response(e.data.value));

export const fetchDataURL: Feeles['fetchDataURL'] = name =>
  sendMessage('fetchDataURL', name).then(e => e.data.value as string);

export const fetchText: Feeles['fetchText'] = name =>
  sendMessage('fetchText', name).then(e => e.data.value as string);

export const fetchArrayBuffer: Feeles['fetchArrayBuffer'] = name =>
  sendMessage('fetchArrayBuffer', name).then(e => e.data.value as ArrayBuffer);

export const resolve: Feeles['resolve'] = name =>
  sendMessage('resolve', name).then(e => e.data.value as string);

export const saveAs: Feeles['saveAs'] = (blob, name) =>
  sendMessage('saveAs', [blob, name]).then(nope);

export const reload: Feeles['reload'] = () => window.location.reload();

export const replace: Feeles['replace'] = url =>
  sendMessage('replace', url).then(nope);

export const openReadme: Feeles['openReadme'] = fileName =>
  sendMessage('readme', fileName).then(nope);

export const closeReadme: Feeles['closeReadme'] = () =>
  sendMessage('readme', null).then(nope);

export const openMedia: Feeles['openMedia'] = params =>
  sendMessage('media', params).then(nope);

export const closeMedia: Feeles['closeMedia'] = () =>
  sendMessage('media', null).then(nope);

export const openCode: Feeles['openCode'] = (fileName: string) =>
  sendMessage('fetchText', fileName).then(e => {
    code$.next(e.data.value);
    internalEmphasizeDispatcher();
  });

export const closeCode: Feeles['closeCode'] = () => Promise.resolve(); // nope

export const openEditor: Feeles['openEditor'] = fileName =>
  sendMessage('editor', fileName).then(nope);

export const closeEditor: Feeles['closeEditor'] = () =>
  sendMessage('editor', null).then(nope);

export const setAlias: Feeles['setAlias'] = (name, ref) => {
  (window as any)[name] = ref;
  return Promise.resolve();
};

export const runCode: Feeles['runCode'] = () => {
  eval(code$.value);
  return Promise.resolve();
};

export const install: Feeles['install'] = name =>
  sendMessage('install', name).then(nope);

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
export const dispatchOnMessage: Feeles['dispatchOnMessage'] = data =>
  sendMessage('dispatchOnMessage', data).then(nope);

// 親ウィンドウで URL (Same Domain) を window.open する
export const openWindow: Feeles['openWindow'] = (
  url,
  target,
  features,
  replace
) => sendMessage('openWindow', { url, target, features, replace }).then(nope);

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
  log('error', (error && error.message) || error, 'Unknown');
};

// eval する
const eval_: Feeles['eval'] = code => eval(code);
export { eval_ as eval }; // avoid no 'eval' in strict mode

export interface Feeles {
  code$: BehaviorSubject<string>;
  pause$: BehaviorSubject<boolean>;
  input$: BehaviorSubject<IButtonInput>;
  emphasizeCode: () => void;
  showHowToPlay: () => void;
  audioContextReady: Promise<AudioContext>;
  /**
   * Deprecated
   */
  env?: {
    USER_UUID: string;
    VERSION_UUID: string;
  };
  connected: Promise<{ port: MessagePort }>;
  fetch?: (name: string) => Promise<Response>;
  fetchDataURL?: (name: string) => Promise<string>;
  fetchText?: (name: string) => Promise<string>;
  fetchArrayBuffer?: (name: string) => Promise<ArrayBuffer>;
  resolve?: (name: string) => Promise<string>;
  saveAs?: (blob: Blob, name: string) => Promise<void>;
  reload?: () => void;
  replace?: (url: string) => Promise<void>;
  openReadme?: (fileName: string) => Promise<void>;
  closeReadme?: () => Promise<void>;
  openMedia?: (params: void) => Promise<void>;
  closeMedia?: () => Promise<void>;
  openCode?: (fileName: string) => Promise<void>;
  closeCode?: () => Promise<void>;
  openEditor?: (fileName: string) => Promise<void>;
  closeEditor?: () => Promise<void>;
  /**
   * Deprecated
   */
  setAlias?: (name: string, ref: any) => Promise<void>;
  runCode?: () => Promise<void>;
  install?: (name: string) => Promise<void>;
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
  throwError?: (error: any) => void;
  // eval する
  eval?: (code: string) => void;
}
