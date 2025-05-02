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

import Providers from "../Providers";

const renderAssetProviders = async ({ assets, element }) => {
  return renderWithQueryClient(
    <DSProvidersWrapper>
      <ElementsProvider assets={assets}>
        <Providers
          assetUri={element?.uri}
          provider={element?.provider}
          isAsset={isAsset(element)}
          isDependency={isDependency(element)}
        />
      </ElementsProvider>
    </DSProvidersWrapper>
  );
};

const renderE003ProviderDetails = async (assets) => {
  const createdAssets = await getCreatedAssets(
    [
      ...LARGE_WIND_FARM_ASSETS,
      ...COAL_PLANT_COMPLEX_ASSETS,
    ],
    assets
  );
  const e003 = createdAssets.find((assets) => assets.id === "E003");
  return renderAssetProviders({ assets: createdAssets, element: e003 });
};

const waitForProvidersToLoad = async () => {
  await waitForElementToBeRemoved(() => screen.queryByText("Loading provider assets"));
};

const toggleProviders = async (user) => {
  await user.click(screen.getByRole("button", { name: /provider assets/i }));
};

describe("Providers component", () => {
  test("does NOT render provider assets when element is not defined", async () => {
    await renderE003ProviderDetails([]);
    expect(screen.queryByTestId("provider-assets")).not.toBeInTheDocument();
  });

  test("can toggle providers assets", async () => {
    const { user } = await renderE003ProviderDetails(["E003"]);
    await waitForProvidersToLoad();

    expect(
      screen.getByRole("heading", { name: "2 provider assets", level: 3 })
    ).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();

    await toggleProviders(user);
    expect(screen.getByRole("list")).toBeInTheDocument();

    const providers = screen.getAllByRole("listitem");
    expect(providers).toHaveLength(2);

    expect(
      within(providers[0]).getByRole("heading", { name: "Hawk 123 kV Substation - Hands" })
    ).toBeInTheDocument();
    expect(within(providers[0]).getByText("E025")).toBeInTheDocument();

    expect(
      within(providers[1]).getByRole("heading", { name: "Best Coleman Power Station" })
    ).toBeInTheDocument();
    expect(within(providers[1]).getByText("E001")).toBeInTheDocument();

    expect(providers).toMatchSnapshot("providers list");
  });

  test("does NOT show providers when none are found", async () => {
    server.use(
      http.get(createParalogEndpoint("asset/providers"), (req) => {

        const url = new URL(req.request.url);
        const assetUri = url.searchParams.get("assetUri");
        if (assetUri === "https://www.example.com/Instruments#E003") {
          return HttpResponse.json([], { status: 200 });
        }
      })
    );

    await renderE003ProviderDetails(["E003"]);
    await waitForProvidersToLoad();

    expect(screen.queryByTestId("provider-assets")).not.toBeInTheDocument();
  });

  test("renders error message when asset providers cannot be retrieved", async () => {
    server.use(
      http.get(createParalogEndpoint("asset/providers"), (req, res, ctx) => {

        const url = new URL(req.request.url);
        const assetUri = url.searchParams.get("assetUri");
        if (assetUri === "https://www.example.com/Instruments#E003") {
          return HttpResponse.json({
            message: "Depedents for https://www.example.com/Instruments#E003 not found",
          }, { status: 404 })
        }
      })
    );

    await renderE003ProviderDetails(["E001", "E003"]);
    await waitForProvidersToLoad();

    expect(
      screen.getByText("Failed to retrieve providers for https://www.example.com/Instruments#E003")
    ).toBeInTheDocument();
  });

  test("renders error message when one or more providers returns an error", async () => {
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

    const { user } = await renderE003ProviderDetails(["E001", "E003"]);
    await waitForProvidersToLoad();

    await toggleProviders(user);
    const providers = screen.getAllByRole("listitem");
    expect(providers).toHaveLength(2);

    expect(
      within(providers[1]).getByText(
        "Failed to retrieve asset information for https://www.example.com/Instruments#E001"
      )
    ).toBeInTheDocument();
    expect(providers).toMatchSnapshot("providers with error(s)");
  });
});
