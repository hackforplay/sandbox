import { log } from '@hackforplay/log';
import * as React from 'react';
import { audioContextReady, code$, pause$ } from '../sandbox-api';
import utils from '../styles/utils.scss';
import { useObservable } from '../utils';
import { Editor } from './Editor';
import { Pause } from './Pause';

interface OverlayViewProps {
  isLandscape: boolean;
  isEditorOpened: boolean;
  setEditorOpened: (open: boolean) => void;
}

const alreadyDoneGesture = 'already-done-gesture';

export function OverlayView(props: OverlayViewProps) {
  const [needUserAction, setNeedUserAction] = React.useState(
    () => sessionStorage.getItem(alreadyDoneGesture) === null
  );
  React.useEffect(() => {
    audioContextReady.then(() => {
      sessionStorage.setItem(alreadyDoneGesture, 'done');
    });
  }, []);

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
      {needUserAction || paused ? <Pause onClick={onClick} /> : null}
    </div>
  );
}
