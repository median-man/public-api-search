/* 
TODO: finish implementing existing features
  - Implement query
  - Implement favorites
  - Persist state client side
  - Implement scroll to top feature
  - Implement light/dark theme toggle
*/

import {
  useState,
  useId,
  createContext,
  ReactNode,
  useContext,
  useReducer,
} from "react";

import { API, apiData, CorsSupport } from "./api-data";

interface FavoritableApi extends API {
  isFavorite?: boolean;
}

/** Enum of filter toggle states */
export enum Filter {
  cors = "corsFilter",
  https = "httpsFilter",
  favorites = "favoritesFilter",
}

export interface ApiState {
  apis: FavoritableApi[];
  query: string;
  [Filter.cors]: boolean;
  [Filter.https]: boolean;
  [Filter.favorites]: boolean;
}

export type ActionType =
  | { type: "toggle filter"; payload: Filter }
  | { type: "set query"; payload: string }
  | { type: "toggle favorite"; payload: API };

const initialState: ApiState = {
  apis: apiData.entries,
  query: "",
  [Filter.cors]: false,
  [Filter.https]: false,
  [Filter.favorites]: false,
};

export function apiReducer(state: ApiState, action: ActionType): ApiState {
  switch (action.type) {
    case "toggle filter":
      return {
        ...state,
        [action.payload]: !state[action.payload],
      };

    case "set query":
      return state;
    case "toggle favorite":
      return state;
  }
}

const ApiStateContext = createContext({} as ApiState);
const ApiDispatchContext = createContext((action: ActionType) => {});
const useApiState = () => useContext(ApiStateContext);
const useApiDispatch = () => useContext(ApiDispatchContext);

/** State container for the table of apis and the controls */
function ApiContainer() {
  const [state, dispatch] = useReducer(apiReducer, initialState);
  return (
    <ApiDispatchContext.Provider value={dispatch}>
      <ApiStateContext.Provider value={state}>
        <ApiTableControls />
        <ApiTable />
      </ApiStateContext.Provider>
    </ApiDispatchContext.Provider>
  );
}

function ApiTableControls() {
  const dispatch = useApiDispatch();
  const { httpsFilter, corsFilter, favoritesFilter } = useApiState();
  return (
    <>
      <p>Use toggle buttons and search box to filter the table.</p>
      <div className="mb-3 row">
        <div className="col-md-4">
          <div
            id="table-buttons"
            className="btn-group"
            role="group"
            aria-label="Choose filters to apply to the table."
          >
            <input
              type="checkbox"
              className="btn-check"
              id="cors-toggle"
              checked={corsFilter}
              onChange={() =>
                dispatch({ type: "toggle filter", payload: Filter.cors })
              }
            />
            <label className="btn btn-outline-primary" htmlFor="cors-toggle">
              CORS
            </label>
            <input
              type="checkbox"
              className="btn-check"
              id="https-toggle"
              checked={httpsFilter}
              onChange={() =>
                dispatch({ type: "toggle filter", payload: Filter.https })
              }
            />
            <label className="btn btn-outline-primary" htmlFor="https-toggle">
              HTTPS
            </label>
            <input
              type="checkbox"
              className="btn-check"
              id="favorites-toggle"
              checked={favoritesFilter}
              onChange={() =>
                dispatch({ type: "toggle filter", payload: Filter.favorites })
              }
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
    </>
  );
}

function ApiTable() {
  const { apis, httpsFilter, corsFilter, favoritesFilter } = useApiState();
  const filteredApis = apis.filter(
    (api: FavoritableApi): boolean =>
      !(
        (corsFilter && api.Cors !== CorsSupport.yes) ||
        (favoritesFilter && !api.isFavorite) ||
        (httpsFilter && !api.HTTPS)
      )
  );
  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th />
            <th>API</th>
            <th>Category</th>
            <th>Description</th>
            <th>Auth</th>
            <th>HTTPS</th>
            <th>CORS</th>
          </tr>
        </thead>
        <tbody>
          {filteredApis.map((api) => (
            <TableRow key={api.Link} api={api} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface TableRowProps {
  api: API;
}

function TableRow({ api }: TableRowProps) {
  const { API, Auth, Category, Cors, Description, HTTPS, Link } = api;
  return (
    <tr>
      <td>
        <span className="text-warning">
          <Star label="favorite" />
        </span>
      </td>
      <td>
        <a href={Link}>{API}</a>
      </td>
      <td>{Category}</td>
      <td>{Description}</td>
      <td>{Auth}</td>
      <td>{HTTPS && <LargeCheck label="available" />}</td>
      <td>
        <CorsNode cors={Cors} />
      </td>
    </tr>
  );
}

interface CorsNodeProps {
  cors: CorsSupport;
}

function CorsNode({ cors }: CorsNodeProps) {
  switch (cors) {
    case CorsSupport.yes:
      return <LargeCheck label="supported" />;

    case CorsSupport.no:
      return <LargeX label="not supported" />;

    default:
      return <LargeQuestion label="unknown" />;
  }
}

/** Common props for all Svg Icons. */
interface SvgIconProps {
  /** sets aria label */
  label: string;
}

function Star({ label }: SvgIconProps) {
  const titleId = useId();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="currentColor"
      className="bi bi-star"
      viewBox="0 0 16 16"
      aria-labelledby={titleId}
    >
      <title id={titleId}>{label}</title>
      <path
        fillRule="evenodd"
        d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"
      />
    </svg>
  );
}

function LargeCheck({ label }: SvgIconProps) {
  const titleId = useId();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="currentColor"
      className="bi bi-check-lg"
      viewBox="0 0 16 16"
      aria-labelledby={titleId}
    >
      <title id={titleId}>{label}</title>
      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
    </svg>
  );
}

function LargeX({ label }: SvgIconProps) {
  const titleId = useId();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="currentColor"
      className="bi bi-x-lg"
      viewBox="0 0 16 16"
      aria-labelledby={titleId}
    >
      <title id={titleId}>{label}</title>
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
    </svg>
  );
}

function LargeQuestion({ label }: SvgIconProps) {
  const titleId = useId();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="currentColor"
      className="bi bi-question-lg"
      viewBox="0 0 16 16"
    >
      <title id={titleId}>{label}</title>
      <path
        fillRule="evenodd"
        d="M4.475 5.458c-.284 0-.514-.237-.47-.517C4.28 3.24 5.576 2 7.825 2c2.25 0 3.767 1.36 3.767 3.215 0 1.344-.665 2.288-1.79 2.973-1.1.659-1.414 1.118-1.414 2.01v.03a.5.5 0 0 1-.5.5h-.77a.5.5 0 0 1-.5-.495l-.003-.2c-.043-1.221.477-2.001 1.645-2.712 1.03-.632 1.397-1.135 1.397-2.028 0-.979-.758-1.698-1.926-1.698-1.009 0-1.71.529-1.938 1.402-.066.254-.278.461-.54.461h-.777ZM7.496 14c.622 0 1.095-.474 1.095-1.09 0-.618-.473-1.092-1.095-1.092-.606 0-1.087.474-1.087 1.091S6.89 14 7.496 14Z"
      />
    </svg>
  );
}

export default ApiContainer;
