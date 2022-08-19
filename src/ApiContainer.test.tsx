import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ApiContainer, {
  ActionType,
  apiReducer,
  ApiState,
  Filter,
  MAX_APIS,
} from "./ApiContainer";
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

describe("ApiContainer", () => {
  test("should render", () => {
    render(<ApiContainer />);
  });

  test(`should show up to ${MAX_APIS} apis`, () => {
    render(<ApiContainer />);

    expect(getAllApiRows()).toHaveLength(
      Math.min(apiData.entries.length, MAX_APIS)
    );
  });

  test("should filter by cors", () => {
    render(<ApiContainer />);

    const corsToggle = screen.getByRole("checkbox", { name: /cors/i });

    userEvent.click(corsToggle);

    const rows = getAllApiRows();

    const expectedLength = Math.min(
      apiData.entries.filter((e) => e.Cors === "yes").length,
      MAX_APIS
    );
    expect(rows).toHaveLength(expectedLength);

    rows.forEach((row) =>
      within(row).getByRole("cell", { name: /supports cors/i })
    );
  });

  test("should filter by https", () => {
    render(<ApiContainer />);

    const httpsToggle = screen.getByRole("checkbox", { name: /https/i });

    userEvent.click(httpsToggle);

    const rows = getAllApiRows();

    const expectedLength = Math.min(
      apiData.entries.filter((e) => e.HTTPS).length,
      MAX_APIS
    );
    expect(rows).toHaveLength(expectedLength);

    rows.forEach((row) => {
      within(row).getByRole("cell", { name: /https available/i });
    });
  });

  test("should filter favorites", () => {
    render(<ApiContainer />);

    // make the first and third rows favorites
    let rows = getAllApiRows();
    toggleFavoriteApi(rows[0]);
    toggleFavoriteApi(rows[2]);

    // toggle favorites filter
    const favoritesToggle = screen.getByRole("checkbox", {
      name: /favorites/i,
    });
    userEvent.click(favoritesToggle);

    // there should only be 2 rows now
    rows = getAllApiRows();
    expect(rows).toHaveLength(2);
  });

  test("should be able to toggle a favorite api", () => {
    render(<ApiContainer />);

    // initial favorite button text
    within(getAllApiRows()[0]).getByRole("button", {
      name: /add to favorites/i,
    });

    toggleFavoriteApi(getAllApiRows()[0]);

    // button text should have changed
    within(getAllApiRows()[0]).getByRole("button", {
      name: /remove from favorites/i,
    });

    toggleFavoriteApi(getAllApiRows()[0]);

    // button text should have reverted
    within(getAllApiRows()[0]).getByRole("button", {
      name: /add to favorites/i,
    });
  });

  /** Returns all rows with api data synchronously */
  function getAllApiRows() {
    // remove header row with slice(1)
    return screen.getAllByRole("row").slice(1);
  }

  /** Fires click event on first api to set isFavorite field to true. */
  function toggleFavoriteApi(apiEl: HTMLElement) {
    const favoriteToggle = within(apiEl).getByRole("button", {
      name: /favorites/i,
    });
    userEvent.click(favoriteToggle);
  }
});
