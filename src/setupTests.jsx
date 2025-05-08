// TODO Delete. This isn't used.
// WHEN have time to verify
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import "vitest-canvas-mock";
import { configure } from "@testing-library/react";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { vi } from "vitest";

import server from "./mocks";

expect.extend({ toMatchImageSnapshot });
configure({ testIdAttribute: "id" });
global.ResizeObserver = require("resize-observer-polyfill");

globalThis.URL.createObjectURL =
  globalThis.URL.createObjectURL || vi.fn(() => "blob:mock-url");


// globalThis.fetch = (...args) => {
//   console.log('Intercepted fetch with args:', args);
//   return originalFetch(...args);
// };

// server.events.on('request:start', ({ request }) => {
//   console.log('Outgoing:', request.method, request.url)
// })

beforeAll(() => server.listen({
  onUnhandledRequest: 'warn',
}));
beforeEach(() => {
  server.resetHandlers();
  vi.restoreAllMocks();
  window.localStorage.clear();
});
afterAll(() => server.close());
vi.mock("react-map-gl", () => ({
  __esModule: true,
  default: ({ children }) => <div id="telicentMap">{children}</div>,
  Source: ({ props, children }) => (
    <div {...props}>
      {props}
      {children}
    </div>
  ),
  Layer: (props) => <div {...props}></div>,
  MapProvider: ({ children }) => <div>{children}</div>,
  Marker: (props) => <div {...props}>{props.children}</div>,
  AttributionControl: () => <div>attribute control</div>,
  ScaleControl: () => <div>scale control</div>,
  useControl: () => ({}),
  useMap: () =>
    vi.fn().mockReturnValue({
      telicentMap: { zoomIn: jest.fn(), zoomOut: jest.fn() },
    }),
}));
