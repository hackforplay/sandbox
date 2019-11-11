import { log } from '@hackforplay/log';
import * as React from 'react';
import { code$, pause$ } from '../sandbox-api';
import view from '../styles/overlay-view.scss';
import utils from '../styles/utils.scss';
import { useObservable } from '../utils';
import { Editor } from './editor';

interface OverlayViewProps {
  isLandscape: boolean;
  isEditorOpened: boolean;
  setEditorOpened: (open: boolean) => void;
}

export function OverlayView(props: OverlayViewProps) {
  const paused = useObservable(pause$, pause$.value);

  return (
    <div
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: 100,
        display: 'flex',
        alignItems: 'stretch',
        flexDirection: props.isLandscape ? 'row-reverse' : 'column-reverse'
      }}
      className={utils.noselect}
    >
      <Editor open={props.isEditorOpened} isLandscape={props.isLandscape} />
      {paused ? (
        <div
          className={view.wrapper}
          onClick={() => {
            if (props.isEditorOpened) {
              pause$.next(false); // PAUSE を解除する
              props.setEditorOpened(false);
              if (props.isEditorOpened) {
                try {
                  eval && eval(code$.value);
                } catch (e) {
                  log('error', (e && e.message) || e, 'マドウショ');
                  console.error(e);
                }
              }
            }
          }}
        >
          <span className={view.resume}>▶︎</span>
        </div>
      ) : null}
    </div>
  );
}
