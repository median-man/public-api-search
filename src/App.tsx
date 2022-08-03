import React, { Suspense, useEffect, useState } from "react";
import "./App.css";
import { ErrorBoundary } from "./ErrorBoundary";
const APITable = React.lazy(() => import("./APITable"));

function App() {
  // TODO: define type for api data
  const [cors, setCors] = useState(false);
  const [https, setHttps] = useState(false);
  const [favorites, setFavorites] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="container pt-5">
      <h1>Search for Public APIs</h1>
      <p>
        All data on public APIs is sourced from{" "}
        <a href="http://github.com/public-apis/public-apis">
          Public APIs
        </a>
        . This page is made to make searching filtering for browser friendly
        APIs easier.
      </p>
      <hr />
      <p>Use toggle buttons and search box to filter the table.</p>
      <div className="mb-3 row">
        <div className="col-md-4">
          <div
            id="table-buttons"
            className="btn-group"
            role="group"
            aria-label="Choose filters to apply to the table."
          >
            <input type="checkbox" className="btn-check" id="cors-toggle" />
            <label className="btn btn-outline-primary" htmlFor="cors-toggle">
              CORS
            </label>
            <input type="checkbox" className="btn-check" id="https-toggle" />
            <label className="btn btn-outline-primary" htmlFor="https-toggle">
              HTTPS
            </label>
            <input
              type="checkbox"
              className="btn-check"
              id="favorites-toggle"
            />
            <label
              className="btn btn-outline-primary"
              htmlFor="favorites-toggle"
            >
              Favorites
            </label>
          </div>
        </div>
        <div className="col-md pt-3 pt-md-0">
          <input
            id="search-input"
            className="form-control d-inline-block"
            placeholder="search"
            aria-label="Search table"
          />
        </div>
      </div>
      <ErrorBoundary fallback={<Alert />}>
        <Suspense fallback={<Loader />}>
          <APITable />
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
      <p>Searching for APIs...</p>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
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
