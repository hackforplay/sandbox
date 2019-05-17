import * as React from 'react';
import { Root } from '@hackforplay/react-ast-mutator-components';
import { parse } from '@babel/parser';
import * as t from '@babel/types';
import { code$ } from '../sandbox-api';

interface EditorProps {
  open: boolean;
}

export const initializeCode = `
スライム.hp = 999;
イモムシ.hp = 9999;
プレイヤー.atk = 1;
プレイヤー.locate(7, 2);
コウモリ.locate(11, 6);
プレイヤー.hp = 99;
`.trim();

const kana = {
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

    code$.next(initializeCode);

    return subscription.unsubscribe;
  }, []);

  if (error) {
    return <span style={{ color: 'red' }}>{error.message}</span>;
  }

  console.log(ast);

  if (!ast) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        height: '100%',
        width: 300,
        backgroundColor: 'white'
      }}
    >
      <Root
        node={ast}
        kana={kana}
        onUpdate={(prev, next) => {
          const current = code$.getValue();
          const updated =
            current.slice(0, prev.start) + next.value + current.slice(prev.end);
          // subscribe せずに、 Hack.code の値だけを変更する
          (code$ as any)._value = updated;
        }}
      />
    </div>
  );
}
