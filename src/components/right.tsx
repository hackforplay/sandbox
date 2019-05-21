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
        ...props.style
      }}
    >
      <button
        onClick={() => props.setEditorOpened(!props.isEditorOpened)}
        style={{ fontSize: 'x-large' }}
      >
        📖
      </button>
    </div>
  );
}
