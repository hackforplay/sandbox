import { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';

export type LocaleKeys =
  | 'Attack'
  | 'Move'
  | 'Press Attack key'
  | 'Touch to start'
  | 'Full Screen'
  | 'Reload'
  | 'How to Play';
export type Locale = { [key in LocaleKeys]: string };

const localeMap: {
  [locale: string]: Locale;
} = {
  en: {
    Attack: 'Attack',
    Move: 'Move',
    'Press Attack key': 'Press Attack key',
    'Touch to start': 'Touch to start',
    'Full Screen': 'Full Screen',
    Reload: 'Reload',
    'How to Play': 'How to Play'
  },
  ja: {
    Attack: 'こうげき',
    Move: 'いどう',
    'Press Attack key': 'こうげき キーを 押してください',
    'Touch to start': 'タッチしてください',
    'Full Screen': 'フルスクリーン',
    Reload: 'さいよみこみ',
    'How to Play': 'そうさせつめい'
  }
};

const internalLanguageCode$ = new BehaviorSubject(
  navigator.language.split('-')[0]
);
const setter = (languageCode: string) => {
  if (
    languageCode !== internalLanguageCode$.value &&
    languageCode in localeMap
  ) {
    internalLanguageCode$.next(languageCode);
  }
};

/**
 * const [t, setLocale] = useLocale()
 * t['Press any key']
 * setLocale('ja')
 */
export const useLocale = (): [Locale, typeof setter] => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const subscription = internalLanguageCode$.subscribe(() => forceUpdate({}));
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const locale = localeMap[internalLanguageCode$.value] || localeMap.en;
  return [locale, setter];
};
