import { log } from '@hackforplay/log';
import classNames from 'classnames';
import * as React from 'react';
import { code$, pause$ } from '../sandbox-api';
import style from '../styles/overlay-view.scss';
import utils from '../styles/utils.scss';
import { useObservable } from '../utils';
import { Editor } from './Editor';
import { Pause } from './Pause';

interface OverlayViewProps {
  isLandscape: boolean;
  isEditorOpened: boolean;
  setEditorOpened: (open: boolean) => void;
}

export function OverlayView(props: OverlayViewProps) {
  const [needUserAction, setNeedUserAction] = React.useState(true);

  const paused = useObservable(pause$, true);
  const onClick = React.useCallback(() => {
    setNeedUserAction(false);
    if (props.isEditorOpened) {
      props.setEditorOpened(false); // close editor view
      try {
        eval && eval(code$.value);
      } catch (e) {
        log('error', (e && e.message) || e, 'マドウショ');
        console.error(e);
      }
    }
  }, [props.isEditorOpened]);

  return (
    <div
      className={classNames(
        style.overlay,
        utils.noselect,
        props.isLandscape && style.landscape
      )}
    >
      <Editor open={props.isEditorOpened} isLandscape={props.isLandscape} />
      {needUserAction || paused ? <Pause onClick={onClick} /> : null}
    </div>
  );
}
