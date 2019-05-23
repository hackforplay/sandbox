import * as React from 'react';
import { audioContextReady } from '../sandbox-api';
import { isTouchEnabled } from '../utils';
import { Keyboard, TouchApp } from './icons';

export function GestureView() {
  const [open, setOpen] = React.useState(true);

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
      <span>{isTouchEnabled ? 'TOUCH TO START' : 'PRESS ANY KEY'}</span>
    </div>
  ) : null;
}
