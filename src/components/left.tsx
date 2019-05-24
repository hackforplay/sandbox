import * as React from 'react';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { IButtonInput, input$ } from '../sandbox-api';
import { isTouchEnabled } from '../utils';

interface LeftProps {
  style: React.CSSProperties;
  rootRef: React.RefObject<HTMLDivElement>;
}
export function Left(props: LeftProps) {
  const fullScreenEnabled = 'fullscreenElement' in window.document;
  const isFullScreen =
    fullScreenEnabled && Boolean(window.document.fullscreenElement);

  return (
    <div
      style={{
        overflow: 'visible',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 8,
        ...props.style
      }}
    >
      <div style={{ flex: 1, height: '10vh', minHeight: 24, maxHeight: 60 }}>
        {fullScreenEnabled ? (
          isFullScreen ? (
            <img
              src={require('../resources/8bit_fullscreen_exit.png')}
              alt=""
              draggable={false}
              style={{
                cursor: 'pointer',
                height: '100%'
              }}
              onClick={() => {
                document.exitFullscreen().catch(console.error);
              }}
            />
          ) : (
            <img
              src={require('../resources/8bit_fullscreen.png')}
              alt=""
              draggable={false}
              style={{
                cursor: 'pointer',
                height: '100%'
              }}
              onClick={() => {
                if (props.rootRef.current) {
                  props.rootRef.current
                    .requestFullscreen()
                    .catch(console.error);
                }
              }}
            />
          )
        ) : null}
        <img
          src={require('../resources/8bit_reload.png')}
          alt=""
          draggable={false}
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
      {isTouchEnabled ? <Pad /> : null}
    </div>
  );
}

type InputDir = keyof IButtonInput | undefined;

const initDir = {
  up: false,
  right: false,
  down: false,
  left: false
};

function Pad() {
  const size = 120;
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [pressed$] = React.useState(() => new Subject<InputDir>());
  const [pressed, setPressed] = React.useState<InputDir>();

  React.useEffect(() => {
    const subscription = pressed$
      .pipe(
        distinctUntilChanged(),
        tap(dir => setPressed(dir)),
        map(dir =>
          dir
            ? { ...input$.value, ...initDir, [dir]: true }
            : { ...input$.value, ...initDir }
        )
      )
      .subscribe(input$);
    return () => subscription.unsubscribe();
  }, []);

  const onTouch = (event: React.TouchEvent) => {
    const primaryTouch = event.touches.item(0);
    if (!primaryTouch || !imgRef.current) return;
    const dir = getURDL(imgRef.current, primaryTouch);
    pressed$.next(dir);
  };

  return (
    <img
      ref={imgRef}
      src={
        pressed
          ? require('../resources/pad_pressed.png')
          : require('../resources/pad.png')
      }
      width={size}
      height={size}
      alt=""
      draggable={false}
      style={{
        transform:
          pressed === 'right'
            ? 'rotate(90deg)'
            : pressed === 'down'
            ? 'rotate(180deg)'
            : pressed === 'left'
            ? 'rotate(270deg)'
            : undefined,
        // disable callout
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
      onContextMenu={e => e.preventDefault()}
      onTouchStart={onTouch}
      onTouchMove={onTouch}
      onTouchEnd={() => pressed$.next()}
      onTouchCancel={() => pressed$.next()}
    />
  );
}

function getURDL(img: HTMLImageElement, touch: React.Touch): InputDir {
  const rect = img.getBoundingClientRect();
  const x = (touch.clientX - rect.left) / rect.width;
  const y = (touch.clientY - rect.top) / rect.height;
  if (x < 0 || x > 1 || y < 0 || y > 1) return;
  if (x > y) {
    if (1 - x > y) {
      return 'up';
    } else {
      return 'right';
    }
  } else {
    if (1 - x > y) {
      return 'left';
    } else {
      return 'down';
    }
  }
}
