/**
 * Vitest 글로벌 Setup
 * jsdom 환경에서 미지원 API를 목업합니다.
 */

// Web Animations API 목업 (jsdom 미지원)
if (typeof Element.prototype.animate !== 'function') {
  Element.prototype.animate = function () {
    return {
      finished: Promise.resolve(),
      cancel: () => {},
      pause: () => {},
      play: () => {},
      reverse: () => {},
      onfinish: null,
      oncancel: null
    };
  };
}

// document.execCommand 목업 (jsdom 미지원)
if (typeof document.execCommand !== 'function') {
  document.execCommand = () => true;
}

// jsdom navigation 경고 억제
const originalConsoleError = console.error;
console.error = (...args) => {
  const msg = typeof args[0] === 'string' ? args[0] : '';
  if (msg.includes('Not implemented: navigation')) return;
  originalConsoleError.apply(console, args);
};
