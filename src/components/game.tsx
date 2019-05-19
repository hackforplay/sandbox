import * as React from 'react';
import { pause$, code$ } from '../sandbox-api';

interface GameProps {
  isEditorOpened: boolean;
  setEditorOpened: (open: boolean) => void;
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
          if (props.isEditorOpened) {
            eval && eval(code$.value);
            props.setEditorOpened(false);
          }
        }
      }}
    />
  );
}
