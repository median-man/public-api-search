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
const getState = () => state;

// Accepts a patch object which is used to update state. Calls all subscribers
// to state with current state.
const updateState = (patch) => {
  state = { ...state, ...patch };
};

// #TODO
// Adds handler fn to subscribers
const subscribe = (listener) => {};

const PageState = { getState, updateState, subscribe };
export default PageState;
