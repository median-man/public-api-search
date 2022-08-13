import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type ThemeValue = "dark" | "light";

// use stored theme first and fallback to prefers-color-scheme media query.
const prefersDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");
const storedTheme = localStorage.getItem("theme") as ThemeValue;
const initialTheme =
  storedTheme || (prefersDarkQuery.matches ? "dark" : "light");

// update body classes
const setBodyTheme = (theme: ThemeValue) => {
  if (theme === "dark") {
    document.body.classList.add("bg-dark", "text-light");
  } else {
    document.body.classList.remove("bg-dark", "text-light");
  }
};

// set initial style before anything render on body to avoid flash if user
// prefers dark
setBodyTheme(initialTheme);

const ThemeCtx = createContext(
  {} as { theme: ThemeValue; toggleTheme: () => void }
);

export function ThemeProvider({ children }: { children?: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeValue>(initialTheme);

  const toggleTheme = useCallback(
    () => setTheme((theme) => (theme === "dark" ? "light" : "dark")),
    []
  );

  useEffect(() => {
    const handleThemeChange = (ev: MediaQueryListEvent) => {
      console.log(ev);
      setTheme(ev.matches ? "dark" : "light");
    };
    prefersDarkQuery.addEventListener("change", handleThemeChange);
    return () =>
      prefersDarkQuery.removeEventListener("change", handleThemeChange);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    setBodyTheme(theme);
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}
