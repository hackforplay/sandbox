import * as React from 'react';
import { fromEvent } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import style from '../styles/gesture-view.scss';
import { useLocale } from '../useLocale';
import { useEvent, isTouchEnabled } from '../utils';

export type PressKey = ' ' | 'ArrowRight' | 'all';

let _openGestureView = (press: PressKey) => {};
export const internalHowToPlayDispatcher = (press: PressKey = 'ArrowRight') => {
  if (!isTouchEnabled) {
    _openGestureView(press);
  }
};

const keydown$ = (key: PressKey) =>
  fromEvent<KeyboardEvent>(window, 'keydown', {
    capture: true
  }).pipe(
    filter(e => e.key === key || key === 'all'),
    first()
  );

export function GestureView() {
  const [showKeyboard, setShowKeyboard] = React.useState<PressKey>();
  React.useEffect(() => {
    _openGestureView = setShowKeyboard;
    return () => {
      _openGestureView = () => {};
    };
  }, []);
  const close = React.useCallback(() => {
    setShowKeyboard(undefined);
  }, []);

  return showKeyboard ? (
    <div className={style.root}>
      <div className={style.blank} />
      <div className={style.pane}>
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
    Math.min(1, window.innerWidth / 818)
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
      className={style.keyboard}
      style={{
        transform: `scale(${scale})`
      }}
    >
      <div className={style.use}>{t['This game use a Keyboard']}</div>
      <img
        src={
          props.pressKey === ' '
            ? require('../resources/keyboard_space_normal.png')
            : props.pressKey === 'ArrowRight'
            ? require('../resources/keyboard_arrow_normal.png')
            : require('../resources/keyboard_all_normal.png')
        }
        className={style.normal}
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
        className={style.bright}
        alt=""
        draggable={false}
      />
    </div>
  );
}
