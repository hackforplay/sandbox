import ResizeObserver from 'resize-observer-polyfill';

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
    }
  });
  observer.observe(game._element.parentNode);
}
