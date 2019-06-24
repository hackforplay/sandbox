import * as React from 'react';

interface MenuButtonProps {
  src: string;
  label: string;
  onClick: () => void;
}

export function MenuButton(props: MenuButtonProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <img
        src={props.src}
        alt=""
        draggable={false}
        style={{
          cursor: 'pointer',
          height: '10vh',
          minHeight: 24,
          maxHeight: 60
        }}
        onClick={props.onClick}
      />
      <span
        style={{
          maxWidth: '100%',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          color: 'white',
          overflow: 'hidden',
          padding: 8,
          paddingTop: 0,
          fontSize: 'x-small',
          userSelect: 'none'
        }}
      >
        {props.label}
      </span>
    </div>
  );
}