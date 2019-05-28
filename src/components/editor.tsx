import { parse } from '@babel/parser';
import * as t from '@babel/types';
import { Root } from '@hackforplay/react-ast-mutator-components';
import * as React from 'react';
import { code$, kana$ } from '../sandbox-api';
import { useObservable } from '../utils';

interface EditorProps {
  open: boolean;
  isLandscape: boolean;
}

export function Editor(props: EditorProps) {
  const [ast, setAst] = React.useState<t.File>();
  const [error, setError] = React.useState<Error>();
  const kana = (useObservable(kana$), kana$.value);

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

  return (
    <div
      style={{
        flex: 0,
        flexBasis: props.open ? 300 : 0,
        transition: 'flex-basis 100ms',
        overflow: 'hidden',
        backgroundColor: 'rgb(255,255,255)',
        pointerEvents: 'initial'
      }}
    >
      {ast ? (
        <Root
          node={ast}
          kana={kana.members}
          style={{
            height: '100%',
            padding: 8
          }}
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
      ) : null}
    </div>
  );
}
