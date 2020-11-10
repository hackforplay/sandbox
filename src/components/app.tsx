import { log } from '@hackforplay/log';
import classNames from 'classnames';
import { orientation } from 'o9n';
import * as React from 'react';
import { code$, pause$ } from '../sandbox-api';
import style from '../styles/app.scss';
import utils from '../styles/utils.scss';
import { hasBlur$, isTouchEnabled, useEvent } from '../utils';
import { Game } from './Game';
import { GestureView } from './GestureView';
import { Left } from './Left';
import { OverlayView } from './OverlayView';
import { Right } from './Right';

const sideBarMinWidth = 86;

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

    if (!open) {
      // 閉じられたとき
      try {
        eval && eval(code$.value);
      } catch (e) {
        log('error', (e && e.message) || e, 'マドウショ');
        console.error(e);
      }
    }
  };

  React.useEffect(() => {
    if (isEditorOpened) return; // ignore event while editor is opened
    // Update pause$ via window focus
    const subscription = hasBlur$.subscribe(pause$);
    return () => subscription.unsubscribe();
  }, [isEditorOpened]);

  return (
    <div className={style.root} ref={rootRef}>
      <div className={style.landscapeWrapper}>
        {isLandscape ? <Left rootRef={rootRef} /> : null}
        <Game />
        {isLandscape ? (
          <Right
            isEditorOpened={isEditorOpened}
            setEditorOpened={setEditorOpened}
          />
        ) : null}
      </div>
      {isLandscape ? null : (
        <div
          className={classNames(
            style.portraitWrapper,
            isTouchEnabled && style.isTouchEnabled
          )}
        >
          <Left rootRef={rootRef} />
          <div className={classNames(style.blank, utils.noselect)} />
          <Right
            isEditorOpened={isEditorOpened}
            setEditorOpened={setEditorOpened}
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
