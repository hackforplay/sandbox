import * as React from 'react';
import { input$ } from '../sandbox-api';
import balloon from '../styles/balloon.scss';
import emphasize from '../styles/emphasize.scss';
import utils from '../styles/utils.scss';
import { useLocale } from '../useLocale';
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
  const [t] = useLocale();

  return (
    <div
      style={{
        overflow: 'visible',
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: 8,
        ...props.style
      }}
    >
      <div
        style={{
          flex: 1,
          height: '10vh',
          maxHeight: 60,
          width: '100%',
          textAlign: 'right'
        }}
        className={utils.noselect}
      >
        <img
          src={require('../resources/enchantbook.png')}
          draggable={false}
          style={{
            cursor: 'pointer',
            height: '100%',
            transition: 'all 250ms'
          }}
          className={isEmphasized ? emphasize.root : ''}
          height={60}
          onClick={() => {
            props.setEditorOpened(!props.isEditorOpened);
            setIsEmphasized(false);
          }}
          alt=""
        />
        {isEmphasized ? (
          <div
            className={balloon.balloon}
            style={{ right: 154, marginTop: -48 }}
          >
            {t["Let's edit program!"]}
          </div>
        ) : null}
      </div>
      {isTouchEnabled ? <AButton /> : null}
      <div style={{ flexGrow: 0, flexShrink: 1, flexBasis: '16%' }} />
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
      draggable={false}
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
