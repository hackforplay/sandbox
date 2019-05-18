import * as React from 'react';
import { Editor } from './editor';
import { pause$, eval, code$ } from '../sandbox-api';

interface AppProps {}

export function App(props: AppProps) {
  const [isEditorOpened, _setEditorOpened] = React.useState(false);

  const setEditorOpened = (open: boolean) => {
    if (open && pause$.value === false) {
      pause$.next(true); // ゲームを PAUSE する
    }
    _setEditorOpened(open);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'gray',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ flex: 0, minHeight: 50, backgroundColor: 'green' }} />
      <div
        style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}
      >
        <div style={{ flex: 1, minWidth: 100, backgroundColor: 'blue' }} />
        <div
          id="enchant-stage"
          style={{
            flexBasis: 600,
            height: 400,
            width: 600,
            backgroundColor: 'black'
          }}
          onClick={() => {
            if (isEditorOpened && pause$.value === true) {
              pause$.next(false); // PAUSE を解除する
              if (isEditorOpened) {
                eval && eval(code$.value);
                setEditorOpened(false);
              }
            }
          }}
        />
        <div style={{ flex: 1, minWidth: 100, backgroundColor: 'blue' }}>
          <button
            onClick={() => setEditorOpened(!isEditorOpened)}
            style={{ fontSize: 'x-large' }}
          >
            📖
          </button>
        </div>
        <Editor
          open={isEditorOpened}
          onRequestClose={() => setEditorOpened(false)}
        />
      </div>
      <div style={{ flex: 0, minHeight: 50, backgroundColor: 'green' }} />
    </div>
  );
}
