import * as React from 'react';
import { fromEvent, merge } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';
import { audioContextReady } from '../sandbox-api';
import { useLocale } from '../useLocale';
import { hasBlur$, isTouchEnabled, useEvent, useObservable } from '../utils';

let _openGestureView = () => {};
export const internalOpenGestureView = () => _openGestureView();

const alreadyDoneGesture = 'already-done-gesture';

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
  const [open, setOpen] = React.useState(true);
  _openGestureView = () => setOpen(true);
  const notFocused = useObservable(hasBlur$, !document.hasFocus());

  const [t] = useLocale();

  React.useEffect(() => {
    if (!open) return;

    const subscription = input$.subscribe(e => {
      setOpen(false);
      sessionStorage.setItem(alreadyDoneGesture, 'done');
    });
    return () => subscription.unsubscribe();
  }, [open]);

  React.useEffect(() => {
    audioContextReady.then(() => {
      if (sessionStorage.getItem(alreadyDoneGesture) !== null) {
        setOpen(false); // Skip waiting gesture (without how-to-play button pressed)
      }
    });
  }, []);

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
      {isTouchEnabled || notFocused ? <TouchAnimation /> : <Keyboard />}
      <span style={{ paddingBottom: '1rem' }}>
        {isTouchEnabled
          ? t['Touch to start']
          : notFocused
          ? t['Click here']
          : t['Press Attack key']}
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

function TouchAnimation() {
  const [frame, setFrame] = React.useState(0);

  React.useEffect(() => {
    const id = setTimeout(() => setFrame(1 - frame), 500);
    return () => clearInterval(id);
  }, [frame]);

  return (
    <img
      src={
        frame === 0
          ? require('../resources/touch_app1.svg')
          : require('../resources/touch_app2.svg')
      }
      alt="Touch"
      style={{
        margin: '1rem'
      }}
    />
  );
}
