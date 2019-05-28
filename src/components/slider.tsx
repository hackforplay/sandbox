import * as React from 'react';
import { fromEvent } from 'rxjs';

interface SliderProps {
  isLandscape: boolean;
  onMove: (movementX: number, movementY: number) => void;
  style?: React.CSSProperties;
}

export function Slider(props: SliderProps) {
  const [state] = React.useState({
    x: 0,
    y: 0,
    hover: false,
    lastTouch: null as (React.Touch | null)
  });
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const mousemove = fromEvent<MouseEvent>(window, 'mousemove').subscribe(
      e => {
        if (state.hover) {
          if (props.isLandscape) {
            state.x += e.movementX;
          } else {
            state.y += e.movementY;
          }
        }
        props.onMove(state.x, state.y);
      }
    );
    const mouseup = fromEvent<MouseEvent>(window, 'mouseup').subscribe(() => {
      state.hover = false;
    });
    const touchstart = fromEvent<TouchEvent>(
      ref.current,
      'touchstart'
    ).subscribe(e => {
      e.preventDefault();
      if (state.lastTouch) return;
      state.lastTouch = e.touches.length !== 1 ? null : e.touches.item(0);
    });
    const touchmove = fromEvent<TouchEvent>(window, 'touchmove').subscribe(
      e => {
        const { lastTouch } = state;
        if (!lastTouch) return;
        const touch = e.touches.item(0);
        if (touch && touch.identifier === lastTouch.identifier) {
          if (props.isLandscape) {
            state.x += touch.clientX - lastTouch.clientX;
          } else {
            state.y += touch.clientY - lastTouch.clientY;
          }
          props.onMove(state.x, state.y);
        }
        state.lastTouch = touch;
      }
    );
    const touchend = fromEvent<TouchEvent>(window, 'touchend').subscribe(e => {
      state.lastTouch = null;
    });
    return () => {
      mousemove.unsubscribe();
      mouseup.unsubscribe();
      touchstart.unsubscribe();
      touchmove.unsubscribe();
      touchend.unsubscribe();
    };
  }, [state, props.isLandscape, ref.current]);

  return (
    <div
      ref={ref}
      style={props.style}
      onMouseDown={() => {
        state.hover = true;
      }}
    />
  );
}
