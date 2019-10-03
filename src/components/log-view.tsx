import { createLogger, ILogBody } from '@hackforplay/log';
import * as React from 'react';

type R<T, A> = React.Reducer<T, A>;

export function LogView() {
  const loggerRef = React.useRef(createLogger());
  const [, forceUpdate] = React.useReducer<R<number, void>>(i => i + 1, 0);
  const [expanded, toggle] = React.useReducer<R<boolean, any>>(b => !b, false);
  const [query, _setQuery] = React.useState('');
  const setQuery = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => _setQuery(e.currentTarget.value),
    []
  );
  const ignore = React.useCallback(
    (e: React.BaseSyntheticEvent) => e.stopPropagation(),
    []
  );

  const logs = loggerRef.current.logs
    .filter(log => (log.line[1] || '').includes(query))
    .slice(-1000);
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
        width: '100%',
        fontSize: expanded ? '1rem' : '0.75rem'
      }}
    >
      {expanded ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            backgroundColor: '#D8D8D8',
            cursor: 'pointer'
          }}
          onClick={toggle}
        >
          <input
            type="text"
            placeholder="Filter"
            value={query}
            onChange={setQuery}
            onClick={ignore}
            autoFocus
          />
        </div>
      ) : null}
      {!expanded && first ? (
        <LogItem log={first} offsetTime={offsetTime} onClick={toggle} />
      ) : null}
      {expanded
        ? logs.map((log, i) => (
            <LogItem key={i} log={log} offsetTime={offsetTime} />
          ))
        : null}
    </div>
  );
}

export interface LogItemProps {
  log: ILogBody;
  offsetTime: number;
  onClick?: (value: any) => void; // hack for allow react.Dispatch
}

const iconColors: { [type: string]: string | undefined } = {
  info: '#70CAE4',
  asset: '#DCBC5F',
  world: '#20480D',
  system: '#242424',
  error: '#E47070'
};

export function LogItem({ log, offsetTime, onClick }: LogItemProps) {
  const [type, message] = log.line;
  const time = (log.time - offsetTime) / 1000;
  const color = iconColors[type] || 'white';
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: onClick && 'pointer'
      }}
      onClick={onClick}
    >
      <span>{(time.toFixed(1) + '').padStart(5, '0')}</span>
      <ColorCircle color={color} />
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

export interface ColorCircleProps {
  color: string;
  onClick?: () => void;
}

export function ColorCircle({ color, onClick }: ColorCircleProps) {
  return (
    <span
      style={{
        borderRadius: '50%',
        width: '1em',
        height: '1em',
        marginLeft: '1em',
        marginRight: '1em',
        backgroundColor: color,
        border: '1px solid white',
        flexShrink: 0,
        cursor: onClick && 'pointer'
      }}
      onClick={onClick}
    />
  );
}
