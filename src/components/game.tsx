import * as React from 'react';
import { code$, eval, pause$ } from '../sandbox-api';

interface GameProps {
  isEditorOpened: boolean;
  setEditorOpened: (open: boolean) => void;
  setRuntimeError: (error?: Error) => void;
}

export function Game(props: GameProps) {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: 'black',
        position: 'relative',
        overflow: 'hidden' // belongs to flex container
      }}
    >
      <div
        id="enchant-stage"
        style={{
          width: '100%', //  This size is used for initialization.
          height: '100%', // will be re-define by enchantjs core.
          backgroundColor: 'red'
        }}
        onClick={() => {
          if (props.isEditorOpened && pause$.value === true) {
            pause$.next(false); // PAUSE を解除する
            props.setEditorOpened(false);
            if (props.isEditorOpened) {
              try {
                eval && eval(code$.value);
                props.setRuntimeError();
              } catch (error) {
                props.setRuntimeError(error);
              }
            }
          }
        }}
      />
    </div>
  );
}
