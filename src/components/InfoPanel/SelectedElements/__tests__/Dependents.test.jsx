import React from "react";
import { screen, waitForElementToBeRemoved, within } from "@testing-library/react";
import { http, HttpResponse, rest } from "msw";

import { ElementsProvider } from "context";
import { createParalogEndpoint } from "api/combined";
import {
  LARGE_WIND_FARM_ASSETS,
  COAL_PLANT_COMPLEX_ASSETS,
  server,
} from "mocks";
import { DSProvidersWrapper, getCreatedAssets, renderWithQueryClient } from "test-utils";
import { isAsset, isDependency } from "utils";

import Dependents from "../Dependents";

const renderAssetDependents = async ({ assets, element }) =>
  renderWithQueryClient(
    <DSProvidersWrapper>
      <ElementsProvider assets={assets}>
        <Dependents
          assetUri={element?.uri}
          dependent={element?.dependent}
          isAsset={isAsset(element)}
          isDependency={isDependency(element)}
        />
      </ElementsProvider>
    </DSProvidersWrapper>
  );

const renderE003AssetDetails = async (assets) => {
  const createdAssets = await getCreatedAssets(
    [
      ...LARGE_WIND_FARM_ASSETS,
      ...COAL_PLANT_COMPLEX_ASSETS,
    ],
    assets
  );
  const e003 = createdAssets.find((assets) => assets.id === "E003");
  return renderAssetDependents({ assets: createdAssets, element: e003 });
};

const waitForDependentsToLoad = async () => {
  await waitForElementToBeRemoved(() => screen.queryByText("Loading dependent assets"));
};

const toggleDependents = async (user) => {
  await user.click(screen.getByRole("button", { name: /dependent assets/i }));
};

describe("Dependents component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test("does NOT render dependent assets when element is not defined", async () => {
    await renderE003AssetDetails([]);
    expect(screen.queryByTestId("dependent-assets")).not.toBeInTheDocument();
  });

  test("can toggle dependents assets", async () => {
    const { user } = await renderE003AssetDetails(["E003"]);
    await waitForDependentsToLoad();

    expect(
      screen.getByRole("heading", { name: "4 dependent assets", level: 3 })
    ).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();

    await toggleDependents(user);
    expect(screen.getByRole("list")).toBeInTheDocument();

    const dependents = screen.getAllByRole("listitem");
    expect(dependents).toHaveLength(4);

    expect(
      within(dependents[0]).getByRole("heading", { name: "Jose 20kv Substation" })
    ).toBeInTheDocument();
    expect(within(dependents[0]).getByText("E008")).toBeInTheDocument();

    expect(
      within(dependents[3]).getByRole("heading", { name: "Best Coleman Power Station" })
    ).toBeInTheDocument();
    expect(within(dependents[3]).getByText("E001")).toBeInTheDocument();

    expect(dependents).toMatchSnapshot("dependents list");
  });

  test("does NOT show dependents when none are found", async () => {
    server.use(
      http.get(createParalogEndpoint("asset/dependents"), (req) => {
        const url = new URL(req.request.url);
        const assetUri = url.searchParams.get("assetUri");
        if (assetUri === "https://www.example.com/Instruments#E003") {
          return HttpResponse.json([], { status: 200 });
        }
      })
    );

    await renderE003AssetDetails(["E001", "E003"]);
    await waitForDependentsToLoad();

    expect(screen.queryByTestId("dependent-assets")).not.toBeInTheDocument();
  });

  test("renders error message when asset dependents cannot be retrieved", async () => {
    server.use(
      http.get(createParalogEndpoint("asset/dependents"), (req) => {

        const url = new URL(req.request.url);
        const assetUri = url.searchParams.get("assetUri");
        if (assetUri === "https://www.example.com/Instruments#E003") {
          return HttpResponse.json({
            message: "Depedents for https://www.example.com/Instruments#E003 not found",
          }, { status: 404 })
        }
      })
    );

    await renderE003AssetDetails(["E001", "E003"]);
    await waitForDependentsToLoad();

    expect(
      screen.getByText("Failed to retrieve dependents for https://www.example.com/Instruments#E003")
    ).toBeInTheDocument();
  });

  test("renders error message when one or more dependents returns an error", async () => {
    server.use(
      http.get(createParalogEndpoint("asset"), (req) => {

        const url = new URL(req.request.url);
        const assetUri = url.searchParams.get("assetUri");
        if (assetUri === "https://www.example.com/Instruments#E001") {
          return HttpResponse.json({
            message: "Asset information for https://www.example.com/Instruments#E001 not found",
          }, { status: 404 })
        }
      })
    );

    const { user } = await renderE003AssetDetails(["E001", "E003"]);
    await waitForDependentsToLoad();

    await toggleDependents(user);
    const dependents = screen.getAllByRole("listitem");
    expect(dependents).toHaveLength(4);

    expect(
      within(dependents[3]).getByText(
        "Failed to retrieve asset information for https://www.example.com/Instruments#E001"
      )
    ).toBeInTheDocument();
    expect(dependents).toMatchSnapshot("dependents with error(s)");
  });
});
