// Mock the window object with the necessary environment variables
global.window = Object.create(window);
global.window.MAP_TILER_TOKEN = "mock-token";
// global.window.PARALOG_API_URL = "http://localhost:4001";
global.window.ONTOLOGY_SERVICE_URL = "http://localhost:3030";
if (typeof window !== "undefined") {
  window.fetch = globalThis.fetch; // ensure MSW can patch this
}

