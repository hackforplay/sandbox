import * as React from 'react';
import { input$ } from '../sandbox-api';

interface RightProps {
  style: React.CSSProperties;
  setEditorOpened: (open: boolean) => void;
  isEditorOpened: boolean;
}

export function Right(props: RightProps) {
  return (
    <div
      style={{
        ...props.style,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ flex: 1, height: '10vh', minHeight: 24, maxHeight: 60 }}>
        <img
          src={require('../resources/enchantbook.png')}
          style={{
            cursor: 'pointer',
            height: '100%'
          }}
          onClick={() => props.setEditorOpened(!props.isEditorOpened)}
          alt=""
        />
      </div>
      <div style={{ flex: 1 }} />
      <AButton />
    </div>
  );
}

function AButton() {
  const size = 100;
  const imgRef = React.useRef<HTMLImageElement>(null);

  const setA = (a: boolean) => {
    const { value } = input$;
    if (value.a !== a) {
      input$.next({ ...value, a });
    }
  };

  const onTouch = (event: React.TouchEvent) => {
    const primaryTouch = event.touches.item(0);
    if (!primaryTouch || !imgRef.current) return;
    const { clientX, clientY } = primaryTouch;
    const { left, top, right, bottom } = imgRef.current.getBoundingClientRect();
    setA(
      left <= clientX && clientX <= right && top <= clientY && clientY <= bottom
    );
  };

  return (
    <img
      ref={imgRef}
      src={require('../resources/attack.png')}
      width={size}
      height={size}
      alt=""
      onContextMenu={e => e.preventDefault()}
      onTouchStart={onTouch}
      onTouchMove={onTouch}
      onTouchEnd={() => setA(false)}
      onTouchCancel={() => setA(false)}
    />
  );
}
