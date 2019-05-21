import * as React from 'react';

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
    </div>
  );
}
