import React from "react";
import { screen, waitForElementToBeRemoved, within } from "@testing-library/react";

import { ElementsProvider } from "context";
import {
  LARGE_WIND_FARMS_AND_COAL_PLANT_COMPLEX_DEPENDENCIES,
  LARGE_WIND_FARM_ASSETS,
  COAL_PLANT_COMPLEX_ASSETS,
} from "mocks";
import {
  DSProvidersWrapper,
  getCreatedAssets,
  getCreatedDependencies,
  renderWithQueryClient,
} from "test-utils";
import { createAssets } from "components/Dataset/dataset-utils";

import ElementDetails from "../ElementDetails";

const renderElementDetails = ({ element, expand }) =>
  renderWithQueryClient(
    <DSProvidersWrapper>
      <ElementDetails element={element} expand={expand} onViewDetails={jest.fn()} />
    </DSProvidersWrapper>,
    { wrapper: ElementsProvider }
  );

const waitForDetailsToLoad = async () => {
  await waitForElementToBeRemoved(() => screen.queryByText("Fetching element details"));
};

const renderAssetDetails = async ({ assets, ids, expand }) => {
  const mockFindIcon = jest.fn().mockReturnValue({
    classUri: "http://telicent/test/ontology#elementDetails",
    color: "#DDDDDD",
    backgroundColor: "#121212",
    iconFallbackText: "ED",
    alt: "ElementDetailsIcon",
  });
  const createdAssets = await getCreatedAssets(assets, ids, mockFindIcon);
  return renderElementDetails({ element: createdAssets[0], expand });
};

const renderConnectionDetails = ({ dependencies, ids, expand }) => {
  const createdDependencies = getCreatedDependencies(dependencies, ids);
  renderElementDetails({ element: createdDependencies[0], expand });
};

const renderAndLoadE001Details = async () => {
  await renderAssetDetails({
    assets: COAL_PLANT_COMPLEX_ASSETS,
    ids: ["E001"],
    expand: true,
  });
  await waitForDetailsToLoad();
};

const renderAndLoadE003Details = async () => {
  await renderAssetDetails({
    assets: LARGE_WIND_FARM_ASSETS,
    ids: ["E003"],
    expand: true,
  });
  await waitForDetailsToLoad();
};

const renderAndLoadE001toE003ConnectionDetails = async () => {
  renderConnectionDetails({
    dependencies:
      LARGE_WIND_FARMS_AND_COAL_PLANT_COMPLEX_DEPENDENCIES,
    ids: ["E001 - E003"],
    expand: true,
  });
  await waitForDetailsToLoad();
};

describe("Element details component", () => {
  test("renders asset icon", async () => {
    const mockGetIconStyle = jest.fn().mockReturnValue({
      defaultStyles: {
        dark: {
          backgroundColor: "#FFFF00",
          color: "black",
        },
        light: {
          backgroundColor: "#FFFF00",
          color: "black",
        },
      },
      defaultIcons: {
        icon: "ri-cloudy-fill",
        faIcon: "fa-regular fa-bolt-lightning",
        faUnicode: "",
        faClass: "fa-regular",
      },
    });
    const createdAssets = (
      await createAssets(COAL_PLANT_COMPLEX_ASSETS, mockGetIconStyle, jest.fn())
    ).filter((asset) => asset.id === "E001");

    renderElementDetails({ element: createdAssets[0], expand: true });
    await waitForDetailsToLoad();

    expect(screen.getByTitle("CoalPlantComplex-icon")).toBeInTheDocument();

    // checks dependents are loaded
    expect(await screen.findByRole("heading", { name: "1 dependent asset" })).toBeInTheDocument();

    // checks providers are loaded
    expect(await screen.findByRole("heading", { name: "1 provider asset" })).toBeInTheDocument();
  });

  test("renders summarised asset details", async () => {
    await renderAssetDetails({
      assets: COAL_PLANT_COMPLEX_ASSETS,
      ids: ["E001"],
      expand: false,
    });
    await waitForDetailsToLoad();

    // checks asset name is present
    expect(screen.getByRole("heading", { name: "Best Coleman Power Station" })).toBeInTheDocument();

    // checks asset type is present
    expect(screen.getByText("coal plant complex")).toBeInTheDocument();

    // checks asset ID is present
    expect(screen.getByText("E001")).toBeInTheDocument();

    // checks asset criticality is not present
    expect(screen.queryByText("Criticality: 3")).not.toBeInTheDocument();

    // check description is not rendered
    expect(screen.queryByTestId("description")).not.toBeInTheDocument();

    // checks dependents are not present
    expect(screen.queryByRole("heading", { name: "1 dependent asset" })).not.toBeInTheDocument();

    // checks providers are not present
    expect(screen.queryByRole("heading", { name: "1 provider asset" })).not.toBeInTheDocument();
  });

  test("renders summarised connection details", async () => {
    renderConnectionDetails({
      dependencies:
        LARGE_WIND_FARMS_AND_COAL_PLANT_COMPLEX_DEPENDENCIES,
      ids: ["E001 - E003"],
      expand: false,
    });
    await waitForDetailsToLoad();

    // checks connection name is present
    expect(
      screen.getByRole("heading", {
        name: "Best Coleman Power Station - West Coleman 50kV Substation",
      })
    ).toBeInTheDocument();

    // checks connection ID is present
    expect(screen.getByText("E001 - E003")).toBeInTheDocument();

    // checks asset criticality is not present
    expect(screen.queryByText("Criticality: 3")).not.toBeInTheDocument();

    // checks dependents are not present
    expect(screen.queryByRole("heading", { name: "1 dependent asset" })).not.toBeInTheDocument();

    // checks providers are not present
    expect(screen.queryByRole("heading", { name: "1 provider asset" })).not.toBeInTheDocument();
  });

  test("renders asset details", async () => {
    await renderAndLoadE001Details();

    // checks asset name is present
    expect(screen.getByRole("heading", { name: "Best Coleman Power Station" })).toBeInTheDocument();

    // checks asset type is present
    expect(screen.getByText("coal plant complex")).toBeInTheDocument();

    // checks asset ID is present
    expect(screen.getByText("E001")).toBeInTheDocument();

    // checks asset criticality is present
    expect(screen.getByText("Criticality: 1")).toBeInTheDocument();

    // checks asset description is present
    expect(screen.getByTestId("description")).toHaveTextContent(
      "Coleman power station (or Best power station) is a 1MW Gas Turbine station."
    );

    // checks dependents are loaded
    expect(await screen.findByRole("heading", { name: "1 dependent asset" })).toBeInTheDocument();

    // checks providers are loaded
    expect(await screen.findByRole("heading", { name: "1 provider asset" })).toBeInTheDocument();
  });

  test("does NOT render description when asset doesn't have description", async () => {
    await renderAndLoadE003Details();

    // checks asset name is present
    expect(
      screen.getByRole("heading", { name: "West Coleman 50kV Substation" })
    ).toBeInTheDocument();

    // check description is not rendered
    expect(screen.queryByTestId("description")).not.toBeInTheDocument();

    // checks dependents are loaded
    expect(await screen.findByRole("heading", { name: "4 dependent assets" })).toBeInTheDocument();

    // checks providers are loaded
    expect(await screen.findByRole("heading", { name: "2 provider assets" })).toBeInTheDocument();
  });

  test("renders connection details", async () => {
    await renderAndLoadE001toE003ConnectionDetails();

    // checks connection name is present
    expect(
      screen.getByRole("heading", {
        name: "Best Coleman Power Station - West Coleman 50kV Substation",
      })
    ).toBeInTheDocument();

    // checks connection ID is present
    expect(screen.getByText("E001 - E003")).toBeInTheDocument();

    // checks asset criticality is present
    expect(screen.getByText("Criticality: 2")).toBeInTheDocument();

    // checks dependents are loaded
    expect(await screen.findByRole("heading", { name: "1 dependent asset" })).toBeInTheDocument();

    // checks providers are loaded
    expect(await screen.findByRole("heading", { name: "1 provider asset" })).toBeInTheDocument();
  });

  test("renders error message when details are not found", async () => {
    const uri = "https://www.wow.gov.uk/ReactTests#E001";
    await renderAssetDetails({ assets: [{ uri }], ids: ["E001"], expand: true });
    await waitForDetailsToLoad();
    expect(
      screen.getByText(`An error has occurred while fetching information for ${uri}`)
    ).toBeInTheDocument();
  });

  test("render error message when an element in not provided", async () => {
    renderElementDetails({ expand: true });
    expect(
      screen.getByText("Unable to retrieve details for unknown element or details not found")
    ).toBeInTheDocument();
  });
});
