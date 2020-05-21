Element.prototype.requestFullscreen =
  Element.prototype.requestFullscreen ||
  Element.prototype.webkitRequestFullscreen ||
  Element.prototype.mozRequestFullScreen ||
  Element.prototype.msRequestFullscreen;

Document.prototype.exitFullscreen =
  Document.prototype.exitFullscreen ||
  Document.prototype.webkitCancelFullScreen ||
  Document.prototype.mozCancelFullScreen ||
  Document.prototype.msExitFullscreen;

if (!('fullscreenElement' in document)) {
  const keys = [
    'webkitFullscreenElement',
    'mozFullScreenElement',
    'msFullScreenElement'
  ];
  for (const key of keys) {
    if (key in document) {
      Object.defineProperty(document, 'fullscreenElement', {
        get() {
          return document[key];
        },
        set(value) {
          document[key] = value;
        }
      });
      break;
    }
  }
}
