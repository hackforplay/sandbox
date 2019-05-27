import * as React from 'react';

export function Game() {
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
        style={{
          width: '100%', //  This size is used for initialization.
          height: '100%', // will be re-define by enchantjs core.
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      />
    </div>
  );
}
