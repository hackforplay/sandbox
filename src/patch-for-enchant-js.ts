import ResizeObserver from 'resize-observer-polyfill';
import { pause$ } from './sandbox-api';

let hasCalled = false;
export function patchForEnchantJs(enchant: any) {
  if (hasCalled) return; // call only once
  hasCalled = true;

  const game = enchant.Core.instance;

  // auto resizing
  const observer = new ResizeObserver(entries => {
    for (const entry of entries) {
      const sWidth = entry.contentRect.width;
      const sHeight = entry.contentRect.height;
      const scale = Math.min(sWidth / game.width, sHeight / game.height);
      game.scale = scale; // resize all scene
      // update offset (for mouse/touch event)
      const rect = game._element.getBoundingClientRect();
      game._pageX = rect.left;
      game._pageY = rect.top;
    }
  });
  observer.observe(game._element.parentNode);

  // stop world
  game.rootScene.addEventListener(enchant.Event.CHILD_ADDED, function handler(
    event: any
  ) {
    const group = event.node;
    if (group.name === 'World') {
      game.rootScene.removeEventListener(enchant.Event.CHILD_ADDED, handler);
      let pauseByGame = Boolean(group._stop);
      group.stop = () => (pauseByGame = true);
      group.resume = () => (pauseByGame = false);
      Object.defineProperty(group, '_stop', {
        enumerable: true,
        get() {
          return Boolean(pause$.value || pauseByGame);
        },
        set(value: boolean) {
          pauseByGame = value;
        }
      });
    }
  });
}
