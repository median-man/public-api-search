export const debounce = (cb, timeoutMs) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => cb(...args), timeoutMs);
  };
};

export const prefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)")
  .matches;
