import { ActionType, apiReducer, ApiState, Filter } from "./ApiContainer";
import { apiData } from "./api-data";
describe("apiReducer", () => {
  describe("'toggle filter action", () => {
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

    test("should toggle  filter", () => {
      toggleFilterActionTest(Filter.favorites);
    });
  });
});
