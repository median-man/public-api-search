import React, { Suspense, useState, useEffect } from "react";
import "./App.css";
import { ErrorBoundary } from "./ErrorBoundary";
import { ThemeProvider, useTheme } from "./ThemeContext";
const ApiContainer = React.lazy(() => import("./ApiContainer"));

function App() {
  return (
    <ThemeProvider>
      <div className="container pt-5 position-relative">
        <h1>Search for Public APIs</h1>
        <ThemeToggleButton />
        <p>
          All data on public APIs is sourced from{" "}
          <a href="http://github.com/public-apis/public-apis">Public APIs</a>.
          This page is made to make searching filtering for browser friendly
          APIs easier.
        </p>
        <ErrorBoundary fallback={<Alert />}>
          <Suspense fallback={<Loader />}>
            <ApiContainer />
          </Suspense>
        </ErrorBoundary>
        <ScrollToTopButton />
      </div>
    </ThemeProvider>
  );
}

function Loader() {
  return (
    <div
      id="loader"
      className="d-flex flex-column align-items-center justify-content-center pt-5"
    >
      <p role="status">Searching for APIs...</p>
      <div className="spinner-border"></div>
    </div>
  );
}

function Alert() {
  return (
    <div id="error-view" className="d-none">
      <div className="alert alert-danger" role="alert">
        Unable to download API data. Try visiting the GitHub project for Public
        APIs linked above or try back later.
      </div>
    </div>
  );
}

function ScrollToTopButton() {
  // used to toggle opacity
  const [showBtn, setShowBtn] = useState(false);

  // set button visibility on scroll with 50 ms debounce
  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout>;

    const handleScrollChange = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(
        () => setShowBtn(window.scrollY > window.innerHeight * 1.3),
        50
      );
    };
    window.addEventListener("scroll", handleScrollChange);
    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener("scroll", handleScrollChange);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      id="scroll-top-button"
      className="btn btn-outline-secondary"
      style={{ opacity: showBtn ? 0.8 : 0 }}
      onClick={scrollToTop}
      aria-label="Scroll to top of page"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        fill="currentColor"
        className="bi bi-arrow-up-short"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"
        />
      </svg>{" "}
      Top
    </button>
  );
}

function ThemeToggleButton() {
  const { toggleTheme, theme } = useTheme();
  const size = "2em";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`btn btn-sm position-absolute top-0 end-0 p-0 mt-2 me-2 rounded-circle d-flex justify-content-center align-items-center ${
        theme === "light" ? "btn-outline-secondary" : "btn-outline-info"
      }`}
      aria-label={
        theme === "light" ? "Switch to dark theme" : "Switch to light theme"
      }
      style={{
        width: size,
        height: size,
      }}
    >
      {theme === "light" ? (
        <svg
          width={16}
          height={16}
          fill="currentColor"
          viewBox="0 0 16 16"
          className="bi bi-moon-stars-fill"
          aria-hidden="true"
        >
          <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
          <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
        </svg>
      ) : (
        <svg
          width={16}
          height={16}
          fill="currentColor"
          viewBox="0 0 16 16"
          className="bi bi-brightness-high-fill"
          aria-hidden="true"
        >
          <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
        </svg>
      )}
    </button>
  );
}

export default App;
