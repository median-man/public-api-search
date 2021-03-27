export const debounce = (cb, timeoutMs) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => cb(...args), timeoutMs);
  };
};
