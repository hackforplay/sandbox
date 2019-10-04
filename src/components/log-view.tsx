import { createLogger, ILogBody } from '@hackforplay/log';
import * as React from 'react';

type R<T, A> = React.Reducer<T, A>;

export enum TypeColors {
  info = '#70CAE4',
  asset = '#DCBC5F',
  system = '#242424',
  error = '#E47070'
}
export type DefaultTypes = keyof typeof TypeColors;
export type TypeFilter = { [key in DefaultTypes]: boolean };

export const initialTypeFilter: TypeFilter = Object.assign.call(
  null,
  {},
  ...Object.keys(TypeColors).map(key => ({ [key]: true }))
);

export function LogView() {
  const loggerRef = React.useRef(createLogger());
  const [, forceUpdate] = React.useReducer<R<number, void>>(i => i + 1, 0);
  const [expanded, toggle] = React.useReducer<R<boolean, any>>(b => !b, false);

  const [query, _setQuery] = React.useState('');
  const setQuery = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => _setQuery(e.currentTarget.value),
    []
  );

  const [typeFilter, setTypeFilter] = React.useState(initialTypeFilter);
  const toggleType = (type: string) => () => {
    if (has(type)) {
      const next = { ...typeFilter, [type]: !typeFilter[type] };
      setTypeFilter(next);
    }
  };

  const logs = loggerRef.current.logs
    .filter(log => (has(log.line[0]) ? typeFilter[log.line[0]] : true))
    .filter(log => (log.line[1] || '').includes(query))
    .slice(-1000);
  const [first] = loggerRef.current.logs;
  const [last] = loggerRef.current.logs.slice(-1);
  const offsetTime = (first && first.time) || 0;

  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const isAutoScrollRef = React.useRef(true);

  React.useEffect(() => {
    const logger = createLogger();
    return logger.subscribe(() => {
      forceUpdate();
      requestAnimationFrame(() => {
        const el = scrollerRef.current;
        if (!el || !isAutoScrollRef.current) return;
        el.scrollTo(0, 9999); // auto scroll to down
      });
    });
  }, []);

  const catchScroll = React.useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (isAutoScrollRef.current) {
        if (event.deltaY < 0) {
          isAutoScrollRef.current = false; // when scroll up
        }
      } else {
        const el = scrollerRef.current;
        if (event.deltaY > 0 && el) {
          if (el.scrollTop + el.offsetHeight >= el.scrollHeight) {
            isAutoScrollRef.current = true; // when scrolled down to bottom
          }
        }
      }
    },
    []
  );

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
            alignItems: 'center',
            width: '100%',
            backgroundColor: '#D8D8D8'
          }}
        >
          <input
            type="text"
            placeholder="Filter"
            value={query}
            onChange={setQuery}
            autoFocus
          />
          <div
            style={{
              flex: 1,
              alignSelf: 'stretch',
              cursor: 'pointer',
              marginRight: '1em'
            }}
            onClick={toggle}
          />
          {entries(TypeColors).map(([type, color]) => (
            <ColorCircle
              key={type}
              color={color}
              hidden={!typeFilter[type]}
              onClick={toggleType(type)}
            />
          ))}
        </div>
      ) : null}
      {!expanded && last ? (
        <LogItem log={last} offsetTime={offsetTime} onClick={toggle} />
      ) : null}
      {expanded ? (
        <div
          ref={scrollerRef}
          style={{
            width: '100%',
            maxHeight: '50vh',
            overflowY: 'scroll',
            overflowX: 'hidden'
          }}
          onWheel={catchScroll}
        >
          {logs.map((log, i) => (
            <LogItem key={i} log={log} offsetTime={offsetTime} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export interface LogItemProps {
  log: ILogBody;
  offsetTime: number;
  onClick?: (value: any) => void; // hack for allow react.Dispatch
}

export function LogItem({ log, offsetTime, onClick }: LogItemProps) {
  const [type, message] = log.line;
  const time = (log.time - offsetTime) / 1000;
  const color = has(type) ? TypeColors[type] : 'white';
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
      <span style={{ marginRight: '1em' }}>
        {(time.toFixed(1) + '').padStart(5, '0')}
      </span>
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
  hidden?: boolean;
}

export function ColorCircle({ color, onClick, hidden }: ColorCircleProps) {
  return (
    <span
      style={{
        borderRadius: '50%',
        width: '1em',
        height: '1em',
        marginRight: '1em',
        backgroundColor: color,
        flexShrink: 0,
        cursor: onClick && 'pointer',
        boxSizing: 'border-box',
        borderWidth: onClick ? '0.25em' : 1,
        borderColor: hidden ? 'gray' : 'white',
        borderStyle: 'solid'
      }}
      onClick={onClick}
    />
  );
}

function has(key: string): key is DefaultTypes {
  return key in TypeColors;
}

function entries(typeFilter: typeof TypeColors) {
  return Object.entries(typeFilter) as [DefaultTypes, TypeColors][];
}
