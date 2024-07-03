import APP_CONFIG from "./app-config";

describe("App config", () => {
  test("has paralog api defined", () => {
    expect(APP_CONFIG.api.url).toEqual("http://localhost:4001");
  });

  test("has ontology service defined", () => {
    expect(APP_CONFIG.services.ontology).toEqual("http://localhost:3030");
  });
});
