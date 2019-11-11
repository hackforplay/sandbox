import { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';

export type LocaleKeys =
  | 'Attack'
  | 'Move'
  | 'Press Attack key'
  | 'Touch to start'
  | 'Click here'
  | 'Full Screen'
  | 'Reload'
  | 'How to Play'
  | 'This game use a Keyboard'
  | `Let's edit program!`;
export type Locale = { [key in LocaleKeys]: string };

const localeMap: {
  [locale: string]: Locale;
} = {
  en: {
    Attack: 'Attack',
    Move: 'Move',
    'Press Attack key': 'Press Attack key',
    'Touch to start': 'Touch to start',
    'Click here': 'Click here',
    'Full Screen': 'Full Screen',
    Reload: 'Reload',
    'How to Play': 'How to Play',
    'This game use a Keyboard': 'Use KEYBOARD in this game',
    "Let's edit program!": `Let's rewrite the magic book!`
  },
  ja: {
    Attack: 'こうげき',
    Move: 'いどう',
    'Press Attack key': '「こうげき」のキーを おしてください',
    'Touch to start': 'タッチしてください',
    'Click here': 'ここをクリックしてください',
    'Full Screen': 'フルスクリーン',
    Reload: 'さいよみこみ',
    'How to Play': 'そうさせつめい',
    'This game use a Keyboard': 'このゲームでは、キーボードをつかいます',
    "Let's edit program!": 'まほうの本を 書きかえよう！'
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
