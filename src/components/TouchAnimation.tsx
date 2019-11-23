import * as React from 'react';
import style from '../styles/touch-animation.scss';

export interface TouchAnimationProps {}

export function TouchAnimation(props: TouchAnimationProps) {
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
    <div className={style.touch}>
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
