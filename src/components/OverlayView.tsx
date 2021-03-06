import classNames from 'classnames';
import * as React from 'react';
import { audioContextReady, pause$ } from '../sandbox-api';
import style from '../styles/overlay-view.scss';
import utils from '../styles/utils.scss';
import { useObservable, usePromise } from '../utils';
import { Editor } from './Editor';
import { Pause } from './Pause';

interface OverlayViewProps {
  isLandscape: boolean;
  isEditorOpened: boolean;
  setEditorOpened: (open: boolean) => void;
}

export function OverlayView(props: OverlayViewProps) {
  const paused = useObservable(pause$, true);

  // audioContext が生成されるまではゲームが開始されない
  const [ready] = usePromise(audioContextReady);

  return (
    <div
      className={classNames(
        style.overlay,
        utils.noselect,
        props.isLandscape && style.landscape
      )}
    >
      <Editor open={props.isEditorOpened} isLandscape={props.isLandscape} />
      {paused || !ready ? (
        <Pause onClick={() => props.setEditorOpened(false)} />
      ) : null}
    </div>
  );
}
