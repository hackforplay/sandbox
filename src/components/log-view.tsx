import { createLogger, ILogBody } from '@hackforplay/log';
import * as React from 'react';

type R = React.Reducer<number, void>;

export function LogView() {
  const loggerRef = React.useRef(createLogger());
  const [, forceUpdate] = React.useReducer<R>(i => i + 1, 0);

  const logs = loggerRef.current.logs.slice(-1000);
  const [first] = loggerRef.current.logs;
  const offsetTime = (first && first.time) || 0;

  React.useEffect(() => {
    const logger = createLogger();
    return logger.subscribe(() => forceUpdate());
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'rgb(255,255,255)',
        width: '100%'
      }}
    >
      {logs.map((log, i) => (
        <LogItem key={i} log={log} offsetTime={offsetTime} />
      ))}
    </div>
  );
}

export interface LogItemProps {
  log: ILogBody;
  offsetTime: number;
}

const iconColors: { [type: string]: string | undefined } = {
  info: '#70CAE4',
  asset: '#DCBC5F',
  world: '#20480D',
  system: '#242424',
  error: '#E47070'
};

export function LogItem({ log, offsetTime }: LogItemProps) {
  const [type, message] = log.line;
  const time = (log.time - offsetTime) / 1000;
  const color = iconColors[type] || 'white';
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <span>{(time.toFixed(1) + '').padStart(5, '0')}</span>
      <span
        style={{
          borderRadius: '50%',
          width: '1em',
          height: '1em',
          marginLeft: '1em',
          marginRight: '1em',
          backgroundColor: color,
          border: '1px solid white',
          flexShrink: 0
        }}
      />
      <span
        style={{
          flexGrow: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {message || ''}
      </span>
    </div>
  );
}
