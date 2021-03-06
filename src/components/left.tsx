import classNames from 'classnames';
import * as React from 'react';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { IButtonInput, input$ } from '../sandbox-api';
import style from '../styles/app.scss';
import utils from '../styles/utils.scss';
import { useLocale } from '../useLocale';
import { isTouchEnabled } from '../utils';
import { internalHowToPlayDispatcher } from './GestureView';
import { MenuButton } from './MenuButton';

export interface LeftProps {
  rootRef: React.RefObject<HTMLDivElement>;
}

export function Left({ rootRef }: LeftProps) {
  const [t] = useLocale();
  const [, forceUpdate] = React.useState({});

  const fullScreenEnabled = 'fullscreenElement' in window.document;

  const [isFullScreen, setIsFullScreen] = React.useState(false);
  React.useEffect(() => {
    const handler = setInterval(() => {
      setIsFullScreen(Boolean(window.document.fullscreenElement));
    }, 250);
    return () => {
      clearInterval(handler);
    };
  }, []);

  const toggleFullScreen = React.useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen()?.catch(console.error);
    } else {
      if (rootRef.current) {
        rootRef.current.requestFullscreen()?.catch(console.error);
      }
    }
  }, []);

  return (
    <div className={classNames(style.left, utils.noselect)}>
      <div className={style.container}>
        {fullScreenEnabled ? (
          isFullScreen ? (
            <MenuButton
              src={require('../resources/8bit_fullscreen_exit.png')}
              label={t['Full Screen']}
              onClick={toggleFullScreen}
            />
          ) : (
            <MenuButton
              src={require('../resources/8bit_fullscreen.png')}
              label={t['Full Screen']}
              onClick={toggleFullScreen}
            />
          )
        ) : null}
        <MenuButton
          src={require('../resources/8bit_reload.png')}
          label={t['Reload']}
          onClick={() => {
            window.location.reload();
          }}
        />
        {isTouchEnabled ? null : (
          <MenuButton
            src={require('../resources/8bit_videogame.png')}
            label={t['How to Play']}
            onClick={() => internalHowToPlayDispatcher('all')}
          />
        )}
      </div>
      {isTouchEnabled ? <Pad /> : null}
      <div className={style.space} />
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
        WebkitTouchCallout: 'none'
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
