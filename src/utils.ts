import { useEffect, useState } from 'react';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';

export const isNotUndefined = <T>(t: T | undefined): t is T => t !== undefined;
export const filterNotUndefined = filter(isNotUndefined);

export const keys = <T extends object>(obj: T) => {
  const result: (keyof T)[] = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result.push(key);
    }
  }
  return result;
};

export const isTouchEnabled = (() => {
  const div = document.createElement('div');
  div.setAttribute('ontouchstart', 'return');
  return typeof div.ontouchstart === 'function';
})();

export const useObservable = <T>(
  observable: Observable<T>,
  defaultValue: T
) => {
  const [value, setValue] = useState<T>(defaultValue);
  useEffect(() => {
    const subscription = observable.subscribe(value => setValue(value));
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return value;
};

export const useSubject = <T>(observable: BehaviorSubject<T>) => {
  const [value, setValue] = useState<T>(observable.value);
  useEffect(() => {
    const subscription = observable.subscribe(value => setValue(value));
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return [value, observable.next.bind(observable)];
};

export const useEvent = <T>(
  target: EventTarget,
  key: string,
  getter: () => T
) => {
  const [value, setValue] = useState<T>(getter);
  useEffect(() => {
    const handler = () => setValue(getter());
    target.addEventListener(key, handler, { passive: true });
    return () => {
      target.removeEventListener(key, handler);
    };
  }, []);
  return value;
};

export const hasBlur$ = new BehaviorSubject(!document.hasFocus());
merge(
  fromEvent(window, 'focus').pipe(map(() => false)),
  fromEvent(window, 'blur').pipe(map(() => true))
)
  .pipe(
    debounceTime(100) // for stability
  )
  .subscribe(hasBlur$);

export const usePromise = <T>(promise: Promise<T>) => {
  const [value, setValue] = useState<T>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    promise.then(setValue).catch(setError);
  }, []);

  return [value, error] as const;
};

const timings = {} as { [name: string]: number | undefined };
export function trackTime(name: string, phase: 'start' | 'end') {
  try {
    if (phase === 'start') {
      timings[name] = timings[name] || window.performance?.now();
    } else {
      const start = timings[name];
      const end = window.performance?.now();
      if (!start || !end) return; // 計測できなかった
      window.gtag?.('event', 'timing_complete', {
        name,
        value: end - start
      });
      delete timings[name]; // 重複を避ける
    }
  } catch (error) {
    console.warn(error);
  }
}
