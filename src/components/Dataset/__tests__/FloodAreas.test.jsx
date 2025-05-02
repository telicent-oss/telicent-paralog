import { screen, waitForElementToBeRemoved, within } from "@testing-library/react";
import { http, HttpResponse, rest } from "msw";

import { DatasetContext, DatasetProvider } from "context";
import { createParalogEndpoint } from "api/combined";
import { server } from "mocks";
import { renderWithQueryClient } from "test-utils";

import FloodAreas from "../FloodAreas";

const waitForFloodAreasToLoad = async () => {
  await waitForElementToBeRemoved(() => screen.queryByText("Fetching flood areas"));
};

describe("Flood areas component", () => {
  test("renders flood watch and flood areas", async () => {
    const { user } = renderWithQueryClient(
      <DatasetProvider>
        <FloodAreas />
      </DatasetProvider>
    );
    await waitForFloodAreasToLoad();

    const floodWatchAreaListItems = screen.getAllByRole("listitem");
    const toggleBtns = screen.getAllByRole("button", { name: "Toggle" });

    expect(floodWatchAreaListItems).toHaveLength(1);
    expect(
      within(floodWatchAreaListItems[0]).getByRole("checkbox", { name: "American" })
    ).toBeInTheDocument();

    await user.click(toggleBtns[0]);
    expect(
      within(floodWatchAreaListItems[0]).getByRole("checkbox", {
        name: "Seal bay, Newland, and Seddon on the American",
      })
    ).toBeInTheDocument();
    expect(
      within(floodWatchAreaListItems[0]).getByRole("checkbox", {
        name: "Blackwell, Bordertown, Minipa, Bridgehaven on the American",
      })
    ).toBeInTheDocument();
  });

  test("renders error when flood watch and flood areas are not found", async () => {
    server.use(
      http.get(createParalogEndpoint("flood-watch-areas"), (req, res, ctx) => {
        return HttpResponse.json({ detail: "Flood areas not found" }, { status: 404 });
      })
    );
    renderWithQueryClient(
      <DatasetProvider>
        <FloodAreas />
      </DatasetProvider>
    );
    await waitForFloodAreasToLoad();
    expect(screen.getByText("Flood areas not found")).toBeInTheDocument();
  });

  test("renders calls addSelectedFloodAreas when checkbox is clicked", async () => {
    const mockOnFloodAreaSelect = jest.fn();
    const { user } = renderWithQueryClient(
      <DatasetContext.Provider value={{ addSelectedFloodAreas: mockOnFloodAreaSelect }}>
        <FloodAreas />
      </DatasetContext.Provider>
    );
    await waitForFloodAreasToLoad();

    await user.click(screen.getByRole("checkbox", { name: "American" }));
    expect(mockOnFloodAreaSelect).toHaveBeenCalled();
  });
});
