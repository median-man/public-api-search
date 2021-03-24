/* 
  This module exports methods for managing the page state including the History
  API. This primary function is keeping the URL search params in sync with the
  filtering options applied to the table.
*/
const defaultState = {
  cors: false,
  favorites: false,
  https: false,
  search: "",
};

let state = { ...defaultState };

// #TODO
const subscribers = [];

// Reads query and returns current page state object.
const getState = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const cors = searchParams.get("filters")?.includes("cors") || false;
  const https = searchParams.get("filters")?.includes("https") || false;
  const search = searchParams.get("search") || "";
  return { ...state, cors, https, search };
};

// Accepts a patch object which is used to update state. Calls all subscribers
// to state with current state.
const updateState = (patch) => {
  state = { ...state, ...patch };
  const { cors, https, favorites, search } = state;
  const searchParams = new URLSearchParams();
  const filters = [cors && "cors", https && "https"]
    .filter((toggle) => toggle)
    .join(",");
  if (filters.length) {
    searchParams.append("filters", filters);
  }
  if (search) {
    searchParams.append("search", search);
  }
  window.location.search = searchParams;
};

// #TODO
// Adds handler fn to subscribers
const subscribe = (listener) => {};

const PageState = { getState, updateState, subscribe };
export default PageState;
