import * as React from 'react';
import { audioContextReady } from '../sandbox-api';
import { useLocale } from '../useLocale';
import { isTouchEnabled, useEvent } from '../utils';
import { TouchApp } from './icons';

export function GestureView() {
  const [open, setOpen] = React.useState(true);
  const [t] = useLocale();

  React.useEffect(() => {
    audioContextReady.then(() => setOpen(false));
    if (!isTouchEnabled) {
      if (!document.hasFocus()) {
        focus();
      }
    }
    return () => {};
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
