import { log } from '@hackforplay/log';
import * as React from 'react';
import { code$, pause$ } from '../sandbox-api';
import { useObservable } from '../utils';
import { Editor } from './editor';
import view from '../styles/overlay-view.scss';

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
    >
      <Editor open={props.isEditorOpened} isLandscape={props.isLandscape} />
      {paused ? (
        <div
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            pointerEvents: 'initial'
          }}
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
          <span
            style={{ color: 'white', fontSize: 'xx-large', userSelect: 'none' }}
            className={view.resume}
          >
            ▶︎
          </span>
        </div>
      ) : null}
    </div>
  );
}
