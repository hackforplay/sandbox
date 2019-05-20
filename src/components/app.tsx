import * as React from 'react';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { pause$ } from '../sandbox-api';
import { Editor } from './editor';
import { Game } from './game';

const hasFocus$ = merge(
  fromEvent(window, 'focus').pipe(map(() => false)),
  fromEvent(window, 'blur').pipe(map(() => true))
).pipe(
  debounceTime(100) // for stability
);

interface AppProps {}

export function App(props: AppProps) {
  const [isEditorOpened, _setEditorOpened] = React.useState(false);
  const [runtimeError, setRuntimeError] = React.useState<Error>();
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

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
      ref={rootRef}
    >
      {runtimeError && runtimeError.stack ? (
        <span style={{ flex: 1, color: 'red', minHeight: '1em' }}>
          {runtimeError.stack.split('\n')[0]}
        </span>
      ) : null}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'stretch'
        }}
      >
        <div style={{ flex: 0, minWidth: 100, backgroundColor: 'blue' }} />
        <Game
          isEditorOpened={isEditorOpened}
          setEditorOpened={setEditorOpened}
          setRuntimeError={setRuntimeError}
        />
        <div style={{ flex: 0, minWidth: 100, backgroundColor: 'blue' }}>
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
      <div style={{ flex: 0, backgroundColor: 'green' }}>
        <svg
          fill="white"
          style={{
            cursor: 'pointer',
            height: '10vh',
            minHeight: 24
          }}
          viewBox="0 0 24 24"
          onClick={() => {
            if (isFullScreen) {
              document
                .exitFullscreen()
                .then(() => setIsFullScreen(false))
                .catch(console.error);
            } else {
              if (rootRef.current) {
                rootRef.current
                  .requestFullscreen()
                  .then(() => setIsFullScreen(true))
                  .catch(console.error);
              }
            }
          }}
        >
          <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
        </svg>
      </div>
    </div>
  );
}
