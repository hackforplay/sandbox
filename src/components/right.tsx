import * as React from 'react';
import { input$ } from '../sandbox-api';
import { isTouchEnabled } from '../utils';

let _dispatcher: React.Dispatch<React.SetStateAction<boolean>> | void;
export const internalEmphasizeDispatcher = () => {
  if (_dispatcher) {
    _dispatcher(true);
  }
};

interface RightProps {
  style: React.CSSProperties;
  setEditorOpened: (open: boolean) => void;
  isEditorOpened: boolean;
}

export function Right(props: RightProps) {
  const [isEmphasized, setIsEmphasized] = React.useState(false);
  _dispatcher = setIsEmphasized;

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
            height: '100%',
            marginTop: 30,
            transition: 'all 250ms'
          }}
          className={isEmphasized ? 'hackforplay-emphasize-animation' : ''}
          width={60}
          height={60}
          onClick={() => {
            props.setEditorOpened(!props.isEditorOpened);
            setIsEmphasized(false);
          }}
          alt=""
        />
      </div>
      <div style={{ flex: 1 }} />
      {isTouchEnabled ? <AButton /> : null}
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
      style={{
        // disable callout
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    />
  );
}
