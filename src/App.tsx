import React, { Suspense, useState, useEffect } from "react";
import "./App.css";
import { ErrorBoundary } from "./ErrorBoundary";
const ApiContainer = React.lazy(() => import("./ApiContainer"));

function App() {
  return (
    <div className="container pt-5">
      <h1>Search for Public APIs</h1>
      <p>
        All data on public APIs is sourced from{" "}
        <a href="http://github.com/public-apis/public-apis">Public APIs</a>.
        This page is made to make searching filtering for browser friendly APIs
        easier.
      </p>
      <ErrorBoundary fallback={<Alert />}>
        <Suspense fallback={<Loader />}>
          <ApiContainer />
        </Suspense>
      </ErrorBoundary>
      <ScrollToTopButton />
    </div>
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

export default App;
