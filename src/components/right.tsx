import classNames from 'classnames';
import * as React from 'react';
import { input$ } from '../sandbox-api';
import style from '../styles/app.scss';
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

export interface RightProps {
  setEditorOpened: (open: boolean) => void;
  isEditorOpened: boolean;
}

export function Right({ setEditorOpened, isEditorOpened }: RightProps) {
  const [isEmphasized, setIsEmphasized] = React.useState(false);
  _dispatcher = setIsEmphasized;
  const [t] = useLocale();

  return (
    <div className={style.right}>
      <div className={classNames(style.container, utils.noselect)}>
        <img
          src={require('../resources/enchantbook.png')}
          draggable={false}
          className={classNames(style.book, isEmphasized && emphasize.root)}
          height={60}
          onClick={() => {
            setEditorOpened(!isEditorOpened);
            setIsEmphasized(false);
          }}
          alt=""
        />
        {isEmphasized ? (
          <div className={classNames(style.balloon, balloon.balloon)}>
            {t["Let's edit program!"]}
          </div>
        ) : null}
      </div>
      {isTouchEnabled ? <AButton /> : null}
      <div className={style.space} />
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
    />
  );
}
