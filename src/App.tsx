import React, { Suspense } from "react";
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

export default App;
