import { screen } from "@testing-library/react";
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
import * as mapUtils from "../map-utils";
import PointAssets from "../PointAssets";

describe("Point asset component", () => {

  const getLineStringFeatures = (feature) => feature.geometry.type === "LineString";
  const getPointFeatures = (feature) => feature.geometry.type === "Point";

  const renderPointAssets = (pointAssetProps) => {
    return renderWithQueryClient(<PointAssets {...pointAssetProps} />, {
      wrapper: DSProvidersWrapper,
    });
  };
  test("should generate empty features when there are no elements", () => {
    const spyOnGeneratePointAssetFeatures = jest.spyOn(mapUtils, "generatePointAssetFeatures");
    renderPointAssets();
    expect(spyOnGeneratePointAssetFeatures).toHaveReturnedWith([]);
  });

  test("should generate asset features", async () => {
    const spyOnGeneratePointAssetFeatures = jest.spyOn(mapUtils, "generatePointAssetFeatures");
    const createdAssets = await getCreatedAssets(
      [
        ...LARGE_WIND_FARM_ASSETS,
        ...COAL_PLANT_COMPLEX_ASSETS,
      ],
      ["E001", "E003"]
    );

    renderPointAssets({ assets: createdAssets });

    expect(spyOnGeneratePointAssetFeatures).toBeCalledTimes(1);
    expect(spyOnGeneratePointAssetFeatures.mock.results[0].value).toHaveLength(2);
    expect(spyOnGeneratePointAssetFeatures.mock.results[0].value).toMatchSnapshot();
    expect(screen.getByTestId("https://www.example.com/Instruments#E003")).toBeInTheDocument();
    expect(screen.getByTestId("https://www.example.com/Instruments#E001")).toBeInTheDocument();
  });

  test("should generate dependency features", async () => {
    const spyOnGeneratePointAssetFeatures = jest.spyOn(mapUtils, "generatePointAssetFeatures");
    const createdAssets = await getCreatedAssets(
      [
        ...LARGE_WIND_FARM_ASSETS,
        ...COAL_PLANT_COMPLEX_ASSETS,
      ],
      ["E001", "E003"]
    );

    const createdDependencies = getCreatedDependencies(
      LARGE_WIND_FARMS_AND_COAL_PLANT_COMPLEX_DEPENDENCIES,
      ["E001 - E003"]
    );
    renderPointAssets({ assets: createdAssets, dependencies: createdDependencies });

    expect(spyOnGeneratePointAssetFeatures).toBeCalledTimes(1);
    expect(spyOnGeneratePointAssetFeatures.mock.results[0].value).toHaveLength(3);
    expect(spyOnGeneratePointAssetFeatures.mock.results[0].value).toMatchSnapshot();
  });

  test("should NOT generate dependencies when there are no assets", () => {
    const spyOnGeneratePointAssetFeatures = jest.spyOn(mapUtils, "generatePointAssetFeatures");
    const createdDependencies = getCreatedDependencies(
      LARGE_WIND_FARMS_AND_COAL_PLANT_COMPLEX_DEPENDENCIES,
      ["E001 - E003"]
    );
    renderPointAssets({ dependencies: createdDependencies });

    expect(spyOnGeneratePointAssetFeatures).toBeCalledTimes(1);
    expect(spyOnGeneratePointAssetFeatures).toHaveReturnedWith([]);
  });

  test("should NOT generate features for selected elements which don't exist", async () => {
    const spyOnGeneratePointAssetFeatures = jest.spyOn(mapUtils, "generatePointAssetFeatures");
    const assets = await getCreatedAssets(LARGE_WIND_FARM_ASSETS, [
      "E003",
      "E025",
    ]);
    const selectedElements = await getCreatedAssets(COAL_PLANT_COMPLEX_ASSETS, [
      "E001",
    ]);
    renderPointAssets({ assets, selectedElements });

    expect(spyOnGeneratePointAssetFeatures).toBeCalledTimes(1);
    expect(spyOnGeneratePointAssetFeatures.mock.results[0].value).toHaveLength(2);
    expect(spyOnGeneratePointAssetFeatures.mock.results[0].value).toMatchSnapshot();
  });

  test("should NOT generate point asset features when previously selected assets are removed", async () => {
    const spyOnGeneratePointAssetFeatures = jest.spyOn(mapUtils, "generatePointAssetFeatures");
    const assets = await getCreatedAssets(LARGE_WIND_FARM_ASSETS, [
      "E003",
      "E025",
    ]);

    const { rerender } = renderPointAssets({ assets, selectedElements: assets });

    expect(spyOnGeneratePointAssetFeatures).toBeCalledTimes(1);
    expect(spyOnGeneratePointAssetFeatures.mock.results[0].value).toHaveLength(2);

    rerender(<PointAssets assets={[]} selectedElements={assets} />, {
      wrapper: DSProvidersWrapper,
    });
    expect(spyOnGeneratePointAssetFeatures).toBeCalledTimes(2);
    expect(spyOnGeneratePointAssetFeatures).toHaveReturnedWith([]);
  });

  test("should generate selected point asset features for selected assets which exist", async () => {
    const spyOnGeneratePointAssetFeatures = jest.spyOn(mapUtils, "generatePointAssetFeatures");
    const assets = await getCreatedAssets(
      [
        ...LARGE_WIND_FARM_ASSETS,
        ...COAL_PLANT_COMPLEX_ASSETS,
      ],
      ["E001", "E025", "E003"]
    );
    const { rerender } = renderPointAssets({ assets, selectedElements: assets });

    expect(spyOnGeneratePointAssetFeatures).toBeCalledTimes(1);
    expect(spyOnGeneratePointAssetFeatures.mock.results[0].value).toHaveLength(3);

    const filteredAssets = assets.filter((asset) => {
      const typeFilter = "http://ies.example.com/ontology/ies#CoalPlantComplex";
      const isCoalPlantAsset = asset.type === typeFilter;
      return isCoalPlantAsset;
    });
    rerender(<PointAssets assets={filteredAssets} selectedElements={assets} />, {
      wrapper: DSProvidersWrapper,
    });

    expect(spyOnGeneratePointAssetFeatures).toBeCalledTimes(2);
    expect(spyOnGeneratePointAssetFeatures.mock.results[1].value).toHaveLength(1);
  });

  test("should NOT generate dependency features when previously dependencies when assets are removed", async () => {
    const spyOnGeneratePointAssetFeatures = jest.spyOn(mapUtils, "generatePointAssetFeatures");
    const assets = await getCreatedAssets(
      [
        ...LARGE_WIND_FARM_ASSETS,
        ...COAL_PLANT_COMPLEX_ASSETS,
      ],
      ["E001", "E003"]
    );
    const dependencies = getCreatedDependencies(
      LARGE_WIND_FARMS_AND_COAL_PLANT_COMPLEX_DEPENDENCIES,
      ["E001 - E003"]
    );
    const { rerender } = renderPointAssets({
      assets,
      dependencies,
      selectedElements: dependencies,
    });

    expect(spyOnGeneratePointAssetFeatures).toBeCalledTimes(1);
    const results =
      spyOnGeneratePointAssetFeatures.mock.results[0].value.filter(getLineStringFeatures);
    expect(results).toHaveLength(1);
    expect(results[0].properties.selected).toBe(true);

    rerender(<PointAssets assets={[]} dependencies={[]} selectedElements={dependencies} />, {
      wrapper: DSProvidersWrapper,
    });
    expect(spyOnGeneratePointAssetFeatures).toBeCalledTimes(2);
    expect(spyOnGeneratePointAssetFeatures).toHaveReturnedWith([]);
  });

  test("should generate selected dependency features for assets which exist", async () => {
    const spyOnGeneratePointAssetFeatures = jest.spyOn(mapUtils, "generatePointAssetFeatures");
    const assets = await getCreatedAssets(
      [
        ...LARGE_WIND_FARM_ASSETS,
        ...COAL_PLANT_COMPLEX_ASSETS,
      ],
      ["E001", "E025", "E003"]
    );
    const dependencies = getCreatedDependencies(
      LARGE_WIND_FARMS_AND_COAL_PLANT_COMPLEX_DEPENDENCIES,
      ["E001 - E003", "E003 - E025"]
    );
    const { rerender } = renderPointAssets({
      assets,
      dependencies,
      selectedElements: dependencies,
    });

    expect(spyOnGeneratePointAssetFeatures).toBeCalledTimes(1);
    let results =
      spyOnGeneratePointAssetFeatures.mock.results[0].value.filter(getLineStringFeatures);
    expect(results).toHaveLength(2);
    expect(results[0].properties.selected).toBe(true);
    expect(results[1].properties.selected).toBe(true);

    const filteredAssets = assets.filter((asset) => {
      const typeFilter =
        "http://ies.example.com/ontology/ies#LargeWindFarm";
      const isLargeWindFarmAsset = asset.type === typeFilter;
      return isLargeWindFarmAsset;
    });

    rerender(
      <PointAssets
        assets={filteredAssets}
        dependencies={dependencies}
        selectedElements={dependencies}
      />,
      { wrapper: DSProvidersWrapper }
    );
    expect(spyOnGeneratePointAssetFeatures).toBeCalledTimes(2);
    results = spyOnGeneratePointAssetFeatures.mock.results[1].value.filter(getLineStringFeatures);
    expect(results).toHaveLength(1);
    expect(results[0].properties.selected).toBe(true);
  });

  test("should NOT generate point asset and dependency features when previoulsy selected elements are removed", async () => {
    const spyOnGeneratePointAssetFeatures = jest.spyOn(mapUtils, "generatePointAssetFeatures");
    const assets = await getCreatedAssets(
      [
        ...LARGE_WIND_FARM_ASSETS,
        ...COAL_PLANT_COMPLEX_ASSETS,
      ],
      ["E001", "E003"]
    );
    const dependencies = getCreatedDependencies(
      LARGE_WIND_FARMS_AND_COAL_PLANT_COMPLEX_DEPENDENCIES,
      ["E001 - E003"]
    );
    const { rerender } = renderPointAssets({
      assets,
      dependencies,
      selectedElements: [...assets, ...dependencies],
    });

    expect(spyOnGeneratePointAssetFeatures).toBeCalledTimes(1);
    const assetFeatures =
      spyOnGeneratePointAssetFeatures.mock.results[0].value.filter(getPointFeatures);
    const dependenciesFeatures =
      spyOnGeneratePointAssetFeatures.mock.results[0].value.filter(getLineStringFeatures);
    // Point assets
    expect(assetFeatures).toHaveLength(2);

    // Point asset dependencies
    expect(dependenciesFeatures).toHaveLength(1);
    expect(dependenciesFeatures[0].properties.selected).toBe(true);

    rerender(
      <PointAssets assets={[]} dependencies={[]} selectedElements={[...assets, ...dependencies]} />,
      { wrapper: DSProvidersWrapper }
    );
    expect(spyOnGeneratePointAssetFeatures).toBeCalledTimes(2);
    expect(spyOnGeneratePointAssetFeatures).toHaveReturnedWith([]);
  });

  test("should generate selected point asset and dependency features for elements which exist", async () => {
    const spyOnGeneratePointAssetFeatures = jest.spyOn(mapUtils, "generatePointAssetFeatures");
    const assets = await getCreatedAssets(
      [
        ...LARGE_WIND_FARM_ASSETS,
        ...COAL_PLANT_COMPLEX_ASSETS,
      ],
      ["E001", "E025", "E003"]
    );
    const dependencies = getCreatedDependencies(
      LARGE_WIND_FARMS_AND_COAL_PLANT_COMPLEX_DEPENDENCIES,
      ["E001 - E003", "E003 - E025"]
    );
    const { rerender } = renderPointAssets({
      assets,
      dependencies,
      selectedElements: [...assets, ...dependencies],
    });

    let assetFeatures =
      spyOnGeneratePointAssetFeatures.mock.results[0].value.filter(getPointFeatures);
    let dependenciesFeatures =
      spyOnGeneratePointAssetFeatures.mock.results[0].value.filter(getLineStringFeatures);

    expect(spyOnGeneratePointAssetFeatures).toBeCalledTimes(1);

    // Point assets
    expect(assetFeatures).toHaveLength(3);

    // Point asset dependencies
    expect(dependenciesFeatures).toHaveLength(2);
    expect(dependenciesFeatures[0].properties.selected).toBe(true);
    expect(dependenciesFeatures[1].properties.selected).toBe(true);

    const typeFilter = "http://ies.example.com/ontology/ies#CoalPlantComplex";
    const filteredAssets = assets.filter((asset) => {
      const isCoalPlantAsset = asset.type === typeFilter;
      return !isCoalPlantAsset;
    });
    const filteredDependencies = dependencies.filter((dependency) => {
      const isCoalPlantAsset =
        dependency.dependent.type === typeFilter || dependency.provider.type === typeFilter;
      return !isCoalPlantAsset;
    });
    rerender(
      <PointAssets
        assets={filteredAssets}
        dependencies={filteredDependencies}
        selectedElements={[...assets, ...dependencies]}
      />,
      { wrapper: DSProvidersWrapper }
    );

    assetFeatures = spyOnGeneratePointAssetFeatures.mock.results[1].value.filter(getPointFeatures);
    dependenciesFeatures =
      spyOnGeneratePointAssetFeatures.mock.results[1].value.filter(getLineStringFeatures);

    expect(spyOnGeneratePointAssetFeatures).toBeCalledTimes(2);
    // Point assets
    expect(assetFeatures).toHaveLength(2);

    // Point asset dependencies
    expect(dependenciesFeatures).toHaveLength(1);
    expect(dependenciesFeatures[0].properties.selected).toBe(true);
  });
});
