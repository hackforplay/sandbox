import * as React from 'react';
import { fromEvent, merge } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';
import { audioContextReady } from '../sandbox-api';
import view from '../styles/gesture-view.scss';
import { useLocale } from '../useLocale';
import { hasBlur$, isTouchEnabled, useEvent, useObservable } from '../utils';

export type PressKey = ' ' | 'ArrowRight';

let _openGestureView = (press: PressKey) => {};
export const internalHowToPlayDispatcher = (press: PressKey = 'ArrowRight') =>
  _openGestureView(press);

const alreadyDoneGesture = 'already-done-gesture';

const input$ = isTouchEnabled
  ? fromEvent(window, 'touchend').pipe(first())
  : merge(
      fromEvent<KeyboardEvent>(window, 'keydown', { capture: true }),
      fromEvent<KeyboardEvent>(window, 'keyup', { capture: true })
    ).pipe(
      tap(e => e.stopPropagation()),
      first()
    );

export function GestureView() {
  const [open, setOpen] = React.useState(true);
  const [pressKey, setPressKey] = React.useState(' ');
  React.useEffect(() => {
    _openGestureView = press => {
      setPressKey(press);
      setOpen(true);
    };
    return () => {
      _openGestureView = () => {};
    };
  }, [setOpen]);

  const notFocused = useObservable(hasBlur$, !document.hasFocus());

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
    <div className={view.root}>
      <div className={view.blank} />
      <div className={view.pane}>
        {isTouchEnabled || notFocused ? (
          <TouchAnimation />
        ) : (
          <Keyboard pressKey={pressKey} />
        )}
      </div>
    </div>
  ) : null;
}

interface KeyboardProps {
  pressKey: string;
}

function Keyboard({ pressKey }: KeyboardProps) {
  const scale = useEvent(window, 'resize', () =>
    Math.min(1, window.innerWidth / 796)
  );
  const [t] = useLocale();

  return (
    <div
      className={view.keyboard}
      style={{
        transform: `scale(${scale})`
      }}
    >
      <div className={view.use}>{t['This game use a Keyboard']}</div>
      <img
        src={require('../resources/keyboard_normal.png')}
        className={view.normal}
        alt=""
        draggable={false}
      />
      <img
        src={require('../resources/keyboard_bright.png')}
        className={view.bright}
        alt=""
        draggable={false}
      />
      <div className={view.attack}>{t['Attack']}</div>
      <div className={view.move}>{t['Move']}</div>
      <div className={view.press}>{t['Press Attack key']}</div>
    </div>
  );
}

function TouchAnimation() {
  const [t] = useLocale();

  return (
    <div className={view.touch}>
      <img
        src={require('../resources/touch_app1.svg')}
        alt="Touch"
        className={view.on}
      />
      <img
        src={require('../resources/touch_app2.svg')}
        alt="Touch"
        className={view.off}
      />
      <div className={view.click}>
        {isTouchEnabled ? t['Touch to start'] : t['Click here']}
      </div>
    </div>
  );
}
