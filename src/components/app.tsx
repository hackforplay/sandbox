import * as React from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { pause$ } from '../sandbox-api';
import { isTouchEnabled } from '../utils';
import { Editor } from './editor';
import { Game } from './game';
import { Left } from './left';
import { Right } from './right';

const hasFocus$ = merge(
  fromEvent(window, 'focus').pipe(map(() => false)),
  fromEvent(window, 'blur').pipe(map(() => true))
).pipe(
  debounceTime(100) // for stability
);

const sideBarMinWidth = 120;
const sideBarMinHeight = isTouchEnabled ? 160 : 60;

interface AppProps {}

export function App(props: AppProps) {
  const [isEditorOpened, _setEditorOpened] = React.useState(false);
  const [runtimeError, setRuntimeError] = React.useState<Error>();
  const [isLandscape, setIsLandscape] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = React.useState<number | void>();

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

  React.useEffect(() => {
    const rootObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { height, width } = entry.contentRect;
        const isLandscape = height - (width * 2) / 3 < sideBarMinHeight;
        setIsLandscape(isLandscape);
        // game screen is 3:2
        if (!isLandscape) {
          setMaxHeight((width / 3) * 2);
        } else {
          setMaxHeight(); // reset
        }
      }
    });
    if (rootRef.current) {
      rootObserver.observe(rootRef.current);
    }
    return () => rootObserver.disconnect();
  }, [rootRef.current]);

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
          flex: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          maxHeight
        }}
      >
        {isLandscape ? (
          <Left
            rootRef={rootRef}
            style={{ flex: 0, minWidth: sideBarMinWidth }}
          />
        ) : null}
        <Game
          isEditorOpened={isEditorOpened}
          setEditorOpened={setEditorOpened}
          setRuntimeError={setRuntimeError}
        />
        {isLandscape ? (
          <Right
            isEditorOpened={isEditorOpened}
            setEditorOpened={setEditorOpened}
            style={{ flex: 0, minWidth: sideBarMinWidth }}
          />
        ) : null}
        <Editor
          open={isEditorOpened}
          onRequestClose={() => setEditorOpened(false)}
        />
      </div>
      {isLandscape ? null : (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'stretch',
            minHeight: sideBarMinHeight
          }}
        >
          <Left rootRef={rootRef} style={{ minWidth: sideBarMinWidth }} />
          <div style={{ flex: 1 }} />
          <Right
            isEditorOpened={isEditorOpened}
            setEditorOpened={setEditorOpened}
            style={{ minWidth: sideBarMinWidth }}
          />
        </div>
      )}
    </div>
  );
}
