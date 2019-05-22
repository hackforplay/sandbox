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
