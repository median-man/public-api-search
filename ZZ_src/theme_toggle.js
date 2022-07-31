import { biMoonStarsFillIcon, biSunIcon } from "./icons";

const prefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)")
  .matches;

const STORAGE_KEY = "theme";

// constants for theme values
const DARK = "dark";
const LIGHT = "light";

let theme = prefersDarkTheme ? DARK : LIGHT;

const subscribers = [];

/* Subscribe to theme change and immediately invokes listener with current
theme. */
const subscribe = (fn) => {
  subscribers.push(fn);
  fn(theme);
};

const darkClass = "btn-outline-info";
const lightClass = "btn-outline-secondary";

const applyDarkTheme = (toggleButton) => {
  toggleButton.classList.remove(lightClass);
  toggleButton.classList.add(darkClass);
  toggleButton.title = "Switch to light theme";
  const icon = biSunIcon();
  icon.setAttribute("aria-hidden", "true");
  toggleButton.innerHTML = "";
  toggleButton.append(icon);
};

const applyLightTheme = (toggleButton) => {
  toggleButton.classList.remove(darkClass);
  toggleButton.classList.add(lightClass);
  toggleButton.title = "Switch to dark theme";
  const icon = biMoonStarsFillIcon();
  icon.setAttribute("aria-hidden", "true");
  toggleButton.innerHTML = "";
  toggleButton.append(icon);
};

const setState = (toggleButton, state) => {
  theme = state;
  localStorage.setItem(STORAGE_KEY, theme);
  subscribers.forEach((fn) => fn(state));
  const applyTheme = state === LIGHT ? applyLightTheme : applyDarkTheme;
  applyTheme(toggleButton);
};

const toggleState = (toggleButton) =>
  setState(toggleButton, theme === DARK ? LIGHT : DARK);

const createButton = () => {
  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.classList =
    "btn btn-theme-toggle btn-sm position-absolute top-0 end-0 p-0 mt-2 me-2 rounded-circle d-flex justify-content-center align-items-center";
  toggleButton.setAttribute("aria-label", "Toggle color theme");
  toggleButton.addEventListener("click", (evt) => {
    const toggleButton = evt.currentTarget;
    toggleState(toggleButton);
  });
  return toggleButton;
};

const init = (parent) => {
  const toggleButton = createButton();
  theme = localStorage.getItem(STORAGE_KEY) || theme;
  setState(toggleButton, theme);
  parent.prepend(toggleButton);
};

const isDark = () => theme === DARK;

const ThemeToggle = {
  DARK,
  LIGHT,
  init,
  isDark,
  subscribe,
  theme: () => theme,
};

export default ThemeToggle;
