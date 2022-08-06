import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import App from "./App";

function MockComponent() {
  return <div>mock</div>;
}

jest.mock("./ApiContainer", () => () => <MockComponent />);

test("renders App with a loader until ApiContainer lazy loads", async () => {
  render(<App />);

  // recall that findBy* and getBy* will throw if nothing matches or > 1 match
  // wrapped in await act call to silence warning from react test util
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    await screen.findByRole("heading", {
      name: /search for public apis/i,
    });
    // assert that accessible loader is rendered
    const loader = screen.getByRole("status");
    expect(loader.textContent).toMatch(/searching for apis/i);
  });


  // wait for lazy loaded component
  await screen.findByText(/mock/i);
});
