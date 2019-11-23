import * as React from 'react';
import { filter } from 'rxjs/operators';
import { message$, port } from '../connector';
import { LogView } from './LogView';

export function Game() {
  const gameRef = React.useRef<HTMLDivElement>(null);

  // Capture canvas screen
  React.useEffect(() => {
    const subscription = message$
      .pipe(filter(e => e.data && e.data.query === 'capture'))
      .subscribe(e => {
        const canvas =
          gameRef.current && gameRef.current.querySelector('canvas');
        if (!canvas) return;
        const dataUrl = canvas.toDataURL(e.data.type);

        port.postMessage({
          ...e.data,
          value: {
            dataUrl
          }
        });
      });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div
      style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden' // belongs to flex container
      }}
    >
      <div
        id="enchant-stage"
        ref={gameRef}
        style={{
          width: '100%', //  This size is used for initialization.
          height: '100%', // will be re-define by enchantjs core.
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      />
      <LogView />
    </div>
  );
}
