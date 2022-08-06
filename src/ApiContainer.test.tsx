import { ActionType, apiReducer, ApiState, Filter } from "./ApiContainer";
import { apiData } from "./api-data";

describe("apiReducer", () => {
  let state: ApiState;
  beforeEach(() => {
    state = {
      apis: apiData.entries,
      query: "",
      [Filter.cors]: false,
      [Filter.https]: false,
      [Filter.favorites]: false,
    };
  });

  describe("'toggle filter' action", () => {
    const toggleFilterActionTest = (filter: Filter) => {
      const action: ActionType = {
        type: "toggle filter",
        payload: filter,
      };

      const nextState = apiReducer(state, action);
      expect(nextState).toEqual({ ...state, [filter]: true });
    };

    test("should toggle cors filter", () => {
      toggleFilterActionTest(Filter.cors);
    });

    test("should toggle https filter", () => {
      toggleFilterActionTest(Filter.https);
    });

    test("should toggle favorites filter", () => {
      toggleFilterActionTest(Filter.favorites);
    });
  });

  describe("'set query' action", () => {
    test("should set the query", () => {
      const query = "hello";
      const action: ActionType = {
        type: "set query",
        payload: query,
      };
      const nextState = apiReducer(state, action);
      expect(nextState).toEqual({ ...state, query });
    });
  });

  describe("'toggle favorite' action", () => {
    test("should toggle the favorite property for a given api entry", () => {
      const api = { ...apiData.entries[0] };
      const action: ActionType = {
        type: "toggle favorite",
        payload: api,
      };
      const nextState = apiReducer(state, action);
      expect(nextState).toEqual({
        ...state,
        apis: [{ ...api, isFavorite: true }, ...state.apis.slice(1)],
      });
    });
  });
});
