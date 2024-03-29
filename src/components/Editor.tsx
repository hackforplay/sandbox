import { parse } from '@babel/parser';
import * as t from '@babel/types';
import { Root } from '@hackforplay/react-ast-mutator-components';
import classNames from 'classnames';
import * as React from 'react';
import { code$, kana$ } from '../sandbox-api';
import style from '../styles/editor.scss';
import utils from '../styles/utils.scss';
import { useObservable } from '../utils';
import { Slider } from './Slider';

interface EditorProps {
  open: boolean;
  isLandscape: boolean;
}

const initWidth = window.innerWidth / 2;
const initHeight = window.innerHeight / 2;

export function Editor(props: EditorProps) {
  const [ast, setAst] = React.useState<t.File>();
  const [error, setError] = React.useState<Error>();
  const kana = useObservable(kana$, kana$.value);
  const [width, setWidth] = React.useState(initWidth);
  const [height, setHeight] = React.useState(initHeight);

  React.useEffect(() => {
    const subscription = code$.subscribe({
      next(code) {
        if (!code) {
          // コードが初期値のままセットされていない
          setAst(undefined);
          return;
        }
        try {
          const ast = parse(code, {
            sourceType: 'module'
          });
          setAst(ast);
          setError(undefined);
        } catch (error) {
          setError(error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const [hint, setHint] = React.useState(true);
  const hideHint = React.useCallback(() => setHint(false), []);

  return (
    <>
      <div
        className={classNames(style.editor, utils.select)}
        style={{
          flexBasis: !props.open ? 0 : props.isLandscape ? width : height
        }}
      >
        {ast ? (
          <div className={style.wrapper}>
            <Root
              node={ast}
              kana={kana.members}
              style={{
                height: '100%',
                padding: 8,
                boxSizing: 'border-box',
                zIndex: 1
              }}
              onUpdate={({ prev, next }) => {
                const current = code$.getValue();
                const updated =
                  current.slice(0, prev.start) +
                  next.value +
                  current.slice(prev.end);
                // subscribe せずに、 Hack.code の値だけを変更する
                (code$ as any)._value = updated;
              }}
            />
          </div>
        ) : null}
        {hint ? (
          <div className={style.hint} onClick={hideHint}>
            <img
              src="https://i.gyazo.com/9af05e7848bb0e172d4035b87fbd6f25.gif"
              alt="色のついた文字をクリックすると、入力できるよ"
              width={88}
              height={42}
              draggable={false}
            />
          </div>
        ) : null}
        {error ? <span className={style.error}>{error.message}</span> : null}
        <CodingArea />
      </div>
      <Slider
        isLandscape={props.isLandscape}
        onMove={(movementX, movementY) => {
          if (props.isLandscape) {
            setWidth(initWidth - movementX);
          } else {
            setHeight(initHeight - movementY);
          }
        }}
        className={classNames(
          style.slider,
          props.open && style.open,
          props.isLandscape && style.landscape
        )}
      />
    </>
  );
}

function CodingArea() {
  const code = useObservable(code$, '');

  // テキストコーディングモード
  const [coding, setCoding] = React.useState(false);
  const toggleCoding = React.useCallback(() => setCoding(!coding), [coding]);

  // インタラクティブにコードを編集する
  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      code$.next(event.target.value);
    },
    []
  );

  // 高さを変えられる
  const [height, setHeight] = React.useState(300);

  return (
    <>
      <Slider
        isLandscape={false}
        onMove={(movementX, movementY) => {
          setHeight(300 - movementY);
        }}
        className={classNames(style.slider, coding && style.open)}
      />
      {coding ? (
        <div style={{ flex: `0 0 ${height}px` }}>
          <textarea value={code} onChange={onChange} />
        </div>
      ) : null}
      <button className={style.code} onClick={toggleCoding}>
        code
      </button>
    </>
  );
}
