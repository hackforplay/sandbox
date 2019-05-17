import * as React from 'react';
import { Editor } from './editor';

interface AppProps {}

export function App(props: AppProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'gray',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ flex: 0, minHeight: 50, backgroundColor: 'green' }} />
      <div
        style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}
      >
        <div style={{ flex: 1, minWidth: 100, backgroundColor: 'blue' }} />
        <div
          id="enchant-stage"
          style={{
            flexBasis: 600,
            height: 400,
            width: 600,
            backgroundColor: 'black'
          }}
        />
        <div style={{ flex: 1, minWidth: 100, backgroundColor: 'blue' }} />
        <Editor open />
      </div>
      <div style={{ flex: 0, minHeight: 50, backgroundColor: 'green' }} />
    </div>
  );
}
