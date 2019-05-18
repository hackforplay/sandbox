import * as React from 'react';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, map, share } from 'rxjs/operators';
import { code$, eval, pause$ } from '../sandbox-api';
import { Editor } from './editor';

const hasFocus$ = merge(
  fromEvent(window, 'focus').pipe(map(() => false)),
  fromEvent(window, 'blur').pipe(map(() => true))
).pipe(
  debounceTime(100) // for stability
);

interface AppProps {}

export function App(props: AppProps) {
  const [isEditorOpened, _setEditorOpened] = React.useState(false);

  const setEditorOpened = (open: boolean) => {
    pause$.next(open); // Pause when editor is open
    _setEditorOpened(open);
  };

  React.useEffect(() => {
    if (isEditorOpened) return; // ignore event while editor is opened
    // Update pause$ via window focus
    const subscription = hasFocus$.subscribe(pause$);
    return () => subscription.unsubscribe();
  }, [isEditorOpened]);

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
