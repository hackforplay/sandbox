import { orientation } from 'o9n';
import * as React from 'react';
import { pause$ } from '../sandbox-api';
import { hasBlur$, isTouchEnabled, useEvent } from '../utils';
import { Game } from './game';
import { GestureView } from './gesture-view';
import { Left } from './left';
import { OverlayView } from './overlay-view';
import { Right } from './right';

const sideBarMinWidth = 86;
const sideBarMinHeight = isTouchEnabled ? 300 : 60;

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
    const subscription = hasBlur$.subscribe(pause$);
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
      <div
        style={{
          flex: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'stretch'
        }}
      >
        {isLandscape ? (
          <Left
            isLandscape
            rootRef={rootRef}
            style={{ flex: 0, minWidth: sideBarMinWidth }}
          />
        ) : null}
        <Game />
        {isLandscape ? (
          <Right
            isEditorOpened={isEditorOpened}
            setEditorOpened={setEditorOpened}
            style={{ flex: 0, minWidth: sideBarMinWidth }}
          />
        ) : null}
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
      <OverlayView
        isLandscape={isLandscape}
        isEditorOpened={isEditorOpened}
        setEditorOpened={setEditorOpened}
      />
    </div>
  );
}
