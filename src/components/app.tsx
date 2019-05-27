import { orientation } from 'o9n';
import * as React from 'react';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { pause$ } from '../sandbox-api';
import { isTouchEnabled, useEvent } from '../utils';
import { Editor } from './editor';
import { ErrorView } from './error-view';
import { Game } from './game';
import { GestureView } from './gesture-view';
import { Left } from './left';
import { Right } from './right';

const hasFocus$ = merge(
  fromEvent(window, 'focus').pipe(map(() => false)),
  fromEvent(window, 'blur').pipe(map(() => true))
).pipe(
  debounceTime(100) // for stability
);

const sideBarMinWidth = 86;
const sideBarMinHeight = isTouchEnabled ? 160 : 60;

interface AppProps {}

export function App(props: AppProps) {
  const [isEditorOpened, _setEditorOpened] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const isLandscape = isTouchEnabled
    ? useEvent(orientation, 'change', () =>
        orientation.type.startsWith('landscape')
      )
    : useEvent(
        window,
        'resize',
        () => innerHeight <= (2 / 3) * (innerWidth - sideBarMinWidth * 2)
      );

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
        backgroundImage: `url(${require('../resources/background.png')})`,
        backgroundRepeat: 'repeat',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
      ref={rootRef}
    >
      <ErrorView />
      <div
        style={{
          flex: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          maxHeight: isLandscape ? innerHeight : (innerWidth / 3) * 2
        }}
      >
        {isLandscape ? (
          <Left
            isLandscape
            rootRef={rootRef}
            style={{ flex: 0, minWidth: sideBarMinWidth }}
          />
        ) : null}
        <Game
          isEditorOpened={isEditorOpened}
          setEditorOpened={setEditorOpened}
        />
        {isLandscape ? (
          <Right
            isEditorOpened={isEditorOpened}
            setEditorOpened={setEditorOpened}
            style={{ flex: 0, minWidth: sideBarMinWidth }}
          />
        ) : null}
        <Editor open={isEditorOpened} isLandscape={isLandscape} />
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
          <Left
            isLandscape={false}
            rootRef={rootRef}
            style={{ minWidth: sideBarMinWidth }}
          />
          <div style={{ flex: 1 }} />
          <Right
            isEditorOpened={isEditorOpened}
            setEditorOpened={setEditorOpened}
            style={{ minWidth: sideBarMinWidth }}
          />
        </div>
      )}
      <GestureView />
    </div>
  );
}
