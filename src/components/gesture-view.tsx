import * as React from 'react';
import { fromEvent, merge } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';
import { audioContextReady } from '../sandbox-api';
import view from '../styles/gesture-view.scss';
import { useLocale } from '../useLocale';
import { hasBlur$, isTouchEnabled, useEvent, useObservable } from '../utils';

export type PressKey = ' ' | 'ArrowRight' | 'all';

let _openGestureView = (press: PressKey) => {};
export const internalHowToPlayDispatcher = (press: PressKey = 'ArrowRight') =>
  _openGestureView(press);

const alreadyDoneGesture = 'already-done-gesture';

const touchend$ = isTouchEnabled
  ? fromEvent(window, 'touchend').pipe(first())
  : fromEvent(window, 'mousedown').pipe(first());

const keydown$ = (key: PressKey) =>
  fromEvent<KeyboardEvent>(window, 'keydown', {
    capture: true
  }).pipe(
    filter(e => e.key === key || key === 'all'),
    first()
  );

export function GestureView() {
  const [showTouch, setShowTouch] = React.useState(true);
  const [showKeyboard, setShowKeyboard] = React.useState<PressKey>();
  React.useEffect(() => {
    _openGestureView = setShowKeyboard;
    return () => {
      _openGestureView = () => {};
    };
  }, []);
  const close = React.useCallback(() => {
    setShowTouch(false);
    setShowKeyboard(undefined);
  }, []);

  const notFocused = useObservable(hasBlur$, !document.hasFocus());

  React.useEffect(() => {
    audioContextReady.then(() => {
      if (sessionStorage.getItem(alreadyDoneGesture) !== null) {
        setShowTouch(false); // Skip waiting gesture (without how-to-play button pressed)
      }
    });
    const subscription = touchend$.subscribe(() => {
      sessionStorage.setItem(alreadyDoneGesture, 'done');
    });
    return () => subscription.unsubscribe();
  }, []);

  return showTouch || notFocused ? (
    <div className={view.root}>
      <div className={view.blank} />
      <div className={view.pane}>
        <TouchAnimation onRequestClose={close} />
      </div>
    </div>
  ) : showKeyboard ? (
    <div className={view.root}>
      <div className={view.blank} />
      <div className={view.pane}>
        <Keyboard onRequestClose={close} pressKey={showKeyboard} />
      </div>
    </div>
  ) : null;
}

interface KeyboardProps {
  pressKey: PressKey;
  onRequestClose: () => void;
}

function Keyboard(props: KeyboardProps) {
  const scale = useEvent(window, 'resize', () =>
    Math.min(1, window.innerWidth / 796)
  );
  const [t] = useLocale();

  React.useEffect(() => {
    const subscription = keydown$(props.pressKey).subscribe(() => {
      props.onRequestClose();
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div
      className={view.keyboard}
      style={{
        transform: `scale(${scale})`
      }}
    >
      <div className={view.use}>{t['This game use a Keyboard']}</div>
      <img
        src={
          props.pressKey === ' '
            ? require('../resources/keyboard_space_normal.png')
            : props.pressKey === 'ArrowRight'
            ? require('../resources/keyboard_arrow_normal.png')
            : require('../resources/keyboard_all_normal.png')
        }
        className={view.normal}
        alt=""
        draggable={false}
      />
      <img
        src={
          props.pressKey === ' '
            ? require('../resources/keyboard_space_push.png')
            : props.pressKey === 'ArrowRight'
            ? require('../resources/keyboard_arrow_push.png')
            : require('../resources/keyboard_all_push.png')
        }
        className={view.bright}
        alt=""
        draggable={false}
      />
    </div>
  );
}

interface TouchAnimationProps {
  onRequestClose: () => void;
}

function TouchAnimation(props: TouchAnimationProps) {
  const [t] = useLocale();
  React.useEffect(() => {
    const subscription = touchend$.subscribe(() => {
      props.onRequestClose();
    });
    return () => subscription.unsubscribe();
  }, []);

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
