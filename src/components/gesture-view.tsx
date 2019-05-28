import * as React from 'react';
import { fromEvent, merge } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';
import { useLocale } from '../useLocale';
import { isTouchEnabled, useEvent } from '../utils';
import { TouchApp } from './icons';

let _openGestureView = () => {};
export const internalOpenGestureView = () => _openGestureView();

const storageKey = 'already-done-gesture';
let alreadyDoneGesture = sessionStorage.getItem(storageKey) !== null;

const input$ = isTouchEnabled
  ? fromEvent(window, 'touchend').pipe(first())
  : merge(
      fromEvent<KeyboardEvent>(window, 'keydown', { capture: true }),
      fromEvent<KeyboardEvent>(window, 'keyup', { capture: true })
    ).pipe(
      tap(e => e.stopPropagation()),
      filter(e => e.key === ' '),
      first()
    );

export function GestureView() {
  const [open, setOpen] = React.useState(!alreadyDoneGesture);
  _openGestureView = () => setOpen(true);

  const [t] = useLocale();

  React.useEffect(() => {
    if (!open) return;

    const subscription = input$.subscribe(e => {
      setOpen(false);
      if (!alreadyDoneGesture) {
        sessionStorage.setItem(storageKey, 'done');
        alreadyDoneGesture = true;
      }
    });
    if (!isTouchEnabled) {
      // Enable keyboard input
      if (!document.hasFocus()) {
        focus();
      }
    }
    return () => subscription.unsubscribe();
  }, [open]);

  return open ? (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgb(0,0,0)',
        color: 'rgb(255,255,255)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
      {isTouchEnabled ? <TouchApp /> : <Keyboard />}
      <span>
        {isTouchEnabled ? t['Touch to start'] : t['Press Attack key']}
      </span>
    </div>
  ) : null;
}

function Keyboard() {
  const scale = useEvent(window, 'resize', () =>
    Math.min(1, window.innerWidth / 796)
  );
  const [t] = useLocale();

  return (
    <div
      style={{
        position: 'relative',
        width: 796,
        height: 360,
        transform: `scale(${scale})`
      }}
    >
      <img
        src={require('../resources/keyboard_normal.png')}
        alt=""
        draggable={false}
        style={{ position: 'absolute' }}
      />
      <img
        src={require('../resources/keyboard_bright.png')}
        className="hackforplay-keyboard-animation"
        alt=""
        draggable={false}
        style={{ position: 'absolute', zIndex: 1 }}
      />
      <span style={{ position: 'absolute', left: 325, top: 336, zIndex: 2 }}>
        {t['Attack']}
      </span>
      <span style={{ position: 'absolute', left: 676, top: 336, zIndex: 2 }}>
        {t['Move']}
      </span>
    </div>
  );
}
