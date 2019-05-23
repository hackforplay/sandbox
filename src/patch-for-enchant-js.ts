import ResizeObserver from 'resize-observer-polyfill';
import { audioContextReady, input$, pause$ } from './sandbox-api';
import { keys } from './utils';

let hasCalled = false;
export function patchForEnchantJs(enchant: any) {
  if (hasCalled) return; // call only once
  hasCalled = true;

  const game = enchant.Core.instance;
  const Hack = (window as any).Hack;

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

  // disable stop-on-blur mod
  if (Array.isArray(game._listeners.awake)) {
    for (const handler of game._listeners.awake) {
      if (handler.name === 'stopOnBlur') {
        game.removeEventListener('awake', handler);
      }
    }
  }

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

  // disable Hack.focusOnClick
  Hack && (Hack.focusOnClick = false);

  // use dom button instead of virtual pads
  game.rootScene.addEventListener(enchant.Event.CHILD_ADDED, function handler(
    event: any
  ) {
    const group = event.node;
    if (group.name === 'ControllerGroup') {
      game.rootScene.removeEventListener(enchant.Event.CHILD_ADDED, handler);
      // remove pad
      game.on('awake', () => {
        for (const node of [...group.childNodes]) {
          node.remove();
        }
      });

      // observe input$
      const previousInput = { ...input$.value };
      let lastUpdateAge = -1;
      input$.subscribe({
        next(input) {
          const age = game.rootScene.age + 1;

          for (let button of keys(input)) {
            if (previousInput[button] !== input[button]) {
              if (input[button]) {
                // synchronize frame speed
                if (game.rootScene.age > lastUpdateAge) {
                  game.changeButtonState(button, true);
                  previousInput[button] = true;
                  lastUpdateAge = age;
                }
              } else {
                // synchronize frame speed
                game.on('enterframe', function handler() {
                  if (game.rootScene.age > age) {
                    game.removeEventListener('enterframe', handler);
                    game.changeButtonState(button, false);
                  }
                });
                previousInput[button] = false;
                lastUpdateAge = age + 1;
              }
            }
          }
        }
      });
    }
  });

  // resume AudioContext from user gesture and skip "TOUCH TO START" scene
  if (enchant.ENV.USE_TOUCH_TO_START_SCENE) {
    const touchToStartScene = game._scenes[game._scenes.length - 1];
    if (touchToStartScene) {
      game.removeScene(touchToStartScene);
    }
    audioContextReady.then(audioContext => {
      enchant.WebAudioSound.audioContext = audioContext;
      enchant.WebAudioSound.destination = audioContext.destination;
      game.start();
    });
  }
}
