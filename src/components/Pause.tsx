import * as React from 'react';
import style from '../styles/pause.scss';

export interface PauseProps {
  onClick?: () => void;
}

export function Pause(props: PauseProps) {
  const [frame, setFrame] = React.useState(0);
  React.useEffect(() => {
    const handle = window.setTimeout(() => {
      setFrame(frame + 1);
    }, 600);
    return () => {
      window.clearTimeout(handle);
    };
  }, [frame]);

  return (
    <div className={style.touch} onClick={props.onClick}>
      <img
        src={require('../resources/touch_app1.svg')}
        alt="Touch"
        className={frame % 2 ? style.on : style.off}
      />
      <img
        src={require('../resources/touch_app2.svg')}
        alt="Touch"
        className={frame % 2 ? style.off : style.on}
      />
    </div>
  );
}
