import * as React from 'react';
import { Subject } from 'rxjs';

export interface ICustomeError {
  fileName: string;
  message: string;
  stack?: string;
}

export const runtimeError$ = new Subject<ICustomeError>();
const errors: ICustomeError[] = [];
runtimeError$.subscribe(error => {
  console.error(error.stack || error.message);
  console.error(`Above error was occured in ${error.fileName}`);
  errors.push(error);
});

interface ErrorViewProps {}

export function ErrorView(props: ErrorViewProps) {
  const [current, setCurrent] = React.useState<ICustomeError | void>();

  React.useEffect(() => {
    const subscription = runtimeError$.subscribe({
      next(error) {
        setCurrent(error);
      }
    });
    if (errors.length > 0) {
      setCurrent(errors[0]);
    }
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const index = current ? errors.indexOf(current) : -1;
  const message = current
    ? `[${current.fileName}] ${
        current.stack ? current.stack.split('\n')[0] : current.message
      }`
    : null;

  return index > -1 ? (
    <div style={{ display: 'flex', flex: 0, color: 'white' }}>
      <span style={{ color: 'red' }}>{message}</span>
      <span style={{ flex: 1 }} />
      <span>{index}</span>
      <Button
        disabled={index <= 0}
        onClick={() => setCurrent(errors[index - 1])}
      >
        ↑
      </Button>
      <Button
        disabled={index >= errors.length - 1}
        onClick={() => setCurrent(errors[index + 1])}
      >
        ↓
      </Button>
      <Button style={{ padding: '0 4px' }} onClick={() => setCurrent()}>
        ×
      </Button>
    </div>
  ) : null;
}

interface ButtonProps {
  disabled?: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function Button(props: ButtonProps) {
  return (
    <span
      style={{
        cursor: 'pointer',
        pointerEvents: props.disabled ? 'none' : undefined,
        opacity: props.disabled ? 0.5 : 1,
        ...props.style
      }}
      onClick={props.onClick}
    >
      {props.children}
    </span>
  );
}
