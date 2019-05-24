import { parse } from '@babel/parser';
import * as t from '@babel/types';
import { Root } from '@hackforplay/react-ast-mutator-components';
import * as React from 'react';
import { code$ } from '../sandbox-api';

interface EditorProps {
  open: boolean;
  onRequestClose: () => void;
  isLandscape: boolean;
}

const kana = {
  'player.hp': 'プレイヤーのたいりょく',
  'スライム.hp': 'スライムのたいりょく',
  'イモムシ.hp': 'イモムシのたいりょく',
  'プレイヤー.atk': 'プレイヤーのこうげきりょく',
  'プレイヤー.locate': 'プレイヤーをうごかす',
  'コウモリ.locate': 'コウモリをうごかす',
  'プレイヤー.hp': 'プレイヤーのたいりょく'
};

export function Editor(props: EditorProps) {
  const [ast, setAst] = React.useState<t.File>();
  const [error, setError] = React.useState<Error>();

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
        } catch (error) {
          setError(error);
        }
      }
    });

    return subscription.unsubscribe;
  }, []);

  if (error) {
    return <span style={{ color: 'red' }}>{error.message}</span>;
  }

  if (!ast) {
    return null;
  }

  const trans: React.CSSProperties = props.isLandscape
    ? {
        top: 0,
        height: '100%',
        width: props.open ? 300 : 0
      }
    : {
        bottom: 0,
        width: '100%',
        height: props.open ? 300 : 0
      };

  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        transition: 'width,height 100ms',
        overflow: 'hidden',
        zIndex: 3,
        backgroundColor: 'white',
        ...trans
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch'
        }}
      >
        <button
          style={{ alignSelf: 'flex-end' }}
          onClick={props.onRequestClose}
        >
          x
        </button>
        <Root
          node={ast}
          kana={kana}
          onUpdate={(prev, next) => {
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
    </div>
  );
}
