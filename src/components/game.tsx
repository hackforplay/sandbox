import * as React from 'react';
import { code$, eval, pause$ } from '../sandbox-api';
import { useObservable } from '../utils';
import { runtimeError$ } from './error-view';

interface GameProps {
  isEditorOpened: boolean;
  setEditorOpened: (open: boolean) => void;
}

export function Game(props: GameProps) {
  const paused = (useObservable(pause$), pause$.value);

  return (
    <div
      style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden' // belongs to flex container
      }}
    >
      <div
        id="enchant-stage"
        style={{
          width: '100%', //  This size is used for initialization.
          height: '100%', // will be re-define by enchantjs core.
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      />
      {paused ? (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center'
          }}
          onClick={() => {
            if (props.isEditorOpened) {
              pause$.next(false); // PAUSE を解除する
              props.setEditorOpened(false);
              if (props.isEditorOpened) {
                try {
                  eval && eval(code$.value);
                } catch (error) {
                  runtimeError$.next(error);
                }
              }
            }
          }}
        >
          <span style={{ color: 'white', fontSize: 'xx-large' }}>▶︎</span>
        </div>
      ) : null}
    </div>
  );
}
