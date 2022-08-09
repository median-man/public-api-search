import { add, remove, has, SK_FAVORITES } from "./favorites";

const fakeApiLink = "https://fake.com";

beforeEach(() => {
  window.localStorage.removeItem(SK_FAVORITES);
});

test("add(apiLink) should add apiLink to storage", () => {
  add(fakeApiLink);
  expect(window.localStorage.getItem(SK_FAVORITES)).toBe(
    JSON.stringify([fakeApiLink])
  );
});

test("remove(apiLink) should remove apiLink from storage", () => {
  add(fakeApiLink);
  remove(fakeApiLink);
  expect(window.localStorage.getItem(SK_FAVORITES)).toBe("[]");
});

test("has(apiLink) should return false when apiLink is not in favorites", () => {
  expect(has(fakeApiLink)).toBe(false);
});

test("has(apiLink) should return true when apiLink is in favorites", () => {
  add(fakeApiLink);
  expect(has(fakeApiLink)).toBe(true);
});
