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
      id="enchant-stage"
      style={{
        flexBasis: 600,
        height: 400,
        width: 600,
        backgroundColor: 'black'
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
  );
}
