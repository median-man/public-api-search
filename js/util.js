export const debounce =  (cb, timeoutMs) => (...args) => {
  let timerId;
  clearTimeout(timerId);
  timerId = setTimeout(() => cb(...args), timeoutMs);
};
