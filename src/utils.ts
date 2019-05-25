import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export const isNotUndefined = <T>(t: T | undefined): t is T => t !== undefined;
export const filterNotUndefined = filter(isNotUndefined);

export const keys = <T>(obj: T) => {
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

export const useObservable = <T>(observable: Observable<T>) => {
  const [value, setValue] = useState<T>();
  useEffect(() => {
    const subscription = observable.subscribe(value => setValue(value));
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return value;
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
