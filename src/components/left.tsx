import * as React from 'react';
import { Fullscreen, FullscreenExit, Refresh } from './icons';

interface LeftProps {
  rootRef: React.RefObject<HTMLDivElement>;
  width: number;
}
export function Left(props: LeftProps) {
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  return (
    <div
      style={{
        flex: 0,
        minWidth: props.width,
        backgroundColor: 'blue'
      }}
    >
      {isFullScreen ? (
        <FullscreenExit
          style={{
            cursor: 'pointer',
            height: '10vh',
            maxHeight: 60,
            minHeight: 24
          }}
          onClick={() => {
            document
              .exitFullscreen()
              .then(() => setIsFullScreen(false))
              .catch(console.error);
          }}
        />
      ) : (
        <Fullscreen
          style={{
            cursor: 'pointer',
            height: '10vh',
            maxHeight: 60,
            minHeight: 24
          }}
          onClick={() => {
            if (props.rootRef.current) {
              props.rootRef.current
                .requestFullscreen()
                .then(() => setIsFullScreen(true))
                .catch(console.error);
            }
          }}
        />
      )}

      <Refresh
        style={{
          cursor: 'pointer',
          height: '10vh',
          maxHeight: 60,
          minHeight: 24
        }}
        onClick={() => {
          window.location.reload();
        }}
      />
    </div>
  );
}
