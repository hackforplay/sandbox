import * as React from 'react';
import { Fullscreen, FullscreenExit, Refresh } from './icons';

interface LeftProps {
  style: React.CSSProperties;
  rootRef: React.RefObject<HTMLDivElement>;
}
export function Left(props: LeftProps) {
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  return (
    <div
      style={{
        ...props.style,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'blue'
      }}
    >
      <div style={{ flex: 1, height: '10vh', minHeight: 24, maxHeight: 60 }}>
        {isFullScreen ? (
          <FullscreenExit
            style={{
              cursor: 'pointer',
              height: '100%'
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
              height: '100%'
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
            height: '100%'
          }}
          onClick={() => {
            window.location.reload();
          }}
        />
      </div>
      <div style={{ flex: 1 }} />
    </div>
  );
}
