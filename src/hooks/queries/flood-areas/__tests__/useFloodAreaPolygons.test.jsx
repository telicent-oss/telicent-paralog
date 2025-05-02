import { http, HttpResponse } from "msw";
import { waitFor, renderHook } from "@testing-library/react";

import { ElementsContext } from "context";
import { createParalogEndpoint } from "api/combined";
import { createQueryClientWrapper } from "test-utils";
import { server } from "mocks";

import useFloodAreaPolygons from "../useFloodAreaPolygons";

const createWrapper = (updateErrorNotifications = jest.fn()) => {
  const QueryClientWrapper = createQueryClientWrapper();
  return ({ children }) => (
    <QueryClientWrapper>
      <ElementsContext.Provider value={{ updateErrorNotifications }}>
        {children}
      </ElementsContext.Provider>
    </QueryClientWrapper>
  );
};
describe("useFloodAreaPolygons hook", () => {
  test("returns features when flood is selected", async () => {
    const { result } = renderHook(
      () =>
        useFloodAreaPolygons([
          "http://environment.data.gov.uk/flood-monitoring/id/floodAreas/123ABC456/polygon",
        ]),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.polygonFeatures).toHaveLength(1);
  });

  test("returns empty array when flood area is not selected", async () => {
    server.use(
      http.get(createParalogEndpoint("flood-watch-areas/polygon"), (req, res) => {
        return HttpResponse.json({}, { status: 200 });
      })
    );
    const { result } = renderHook(
      () =>
        useFloodAreaPolygons([
          "http://environment.data.gov.uk/flood-monitoring/id/floodAreas/123ABC456/polygon",
        ]),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.polygonFeatures).toHaveLength(0);
  });

  test("calls onError when an error occurs", async () => {
    const mockErrorNotificationHandler = jest.fn();
    const { result } = renderHook(() => useFloodAreaPolygons(["http://invalid.polygon.uri"]), {
      wrapper: createWrapper(mockErrorNotificationHandler),
    });

    await waitFor(() => expect(mockErrorNotificationHandler).toHaveBeenCalledTimes(1));
    expect(mockErrorNotificationHandler).toHaveBeenCalledWith(
      "Polygon http://invalid.polygon.uri is not found"
    );
    expect(result.current.polygonFeatures).toHaveLength(0);
  });
});
