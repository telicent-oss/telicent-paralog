import React from "react";
import { vi } from "vitest";

import { CytoscapeProvider, DatasetContext, ElementsContext } from "context";
import { DSProvidersWrapper, getCreatedAssets, renderWithQueryClient } from "test-utils";
import { T020_SEGMENTS, T034_SEGMENTS, TRANSPORT_ASSETS } from "mocks";

import TelicentMap from "../TelicentMap";
import * as mapboxFeatures from "../map-utils";

const MapComponent = ({
  assets = [],
  dependencies = [],
  selectedElements = [],
  selectedFloodAreas = [],
}) => (
  <DSProvidersWrapper>
    <CytoscapeProvider>
      <ElementsContext.Provider
        value={{
          assets,
          dependencies,
          selectedElements,
          clearSelectedElements: vi.fn(),
          onElementClick: vi.fn(),
          closeTimelinePanel: vi.fn(),
        }}
      >
        <DatasetContext.Provider value={{ selectedFloodAreas }}>
          <TelicentMap />
        </DatasetContext.Provider>
      </ElementsContext.Provider>
    </CytoscapeProvider>
  </DSProvidersWrapper>
);

describe("Map component", () => {
  test("should generate empty features when there are no elements", async () => {
    const spyOnGenerateLinearAssetFeatures = vi.spyOn(
      mapboxFeatures,
      "generateLinearAssetFeatures"
    );
    renderWithQueryClient(<MapComponent />);

    expect(spyOnGenerateLinearAssetFeatures).toHaveReturnedWith([]);
  });

  test("should generate linear asset features", async () => {
    const spyOnGenerateLinearAssetFeatures = vi.spyOn(
      mapboxFeatures,
      "generateLinearAssetFeatures"
    );
    const createdAssets = await getCreatedAssets(
      TRANSPORT_ASSETS,
      ["T043"],
      vi.fn(),
      vi.fn().mockReturnValue(T034_SEGMENTS)
    );
    renderWithQueryClient(<MapComponent assets={createdAssets} />);

    expect(spyOnGenerateLinearAssetFeatures).toBeCalledTimes(1);
    expect(spyOnGenerateLinearAssetFeatures.mock.results[0].value).toHaveLength(1);
    expect(spyOnGenerateLinearAssetFeatures.mock.results[0].value).toMatchSnapshot();
  });

  test("should NOT generate linear asset features when previously selected assets are removed", async () => {
    const spyOnGenerateLinearAssetFeatures = vi.spyOn(
      mapboxFeatures,
      "generateLinearAssetFeatures"
    );
    const assets = await getCreatedAssets(
      TRANSPORT_ASSETS,
      ["T043"],
      vi.fn(),
      vi.fn().mockReturnValue(T034_SEGMENTS)
    );
    const { rerender } = renderWithQueryClient(
      <MapComponent assets={assets} selectedElements={assets} />
    );

    const results = spyOnGenerateLinearAssetFeatures.mock.results[0].value;
    expect(results).toHaveLength(1);
    expect(results[0].properties.selected).toBe(true);

    rerender(<MapComponent assets={[]} selectedElements={assets} />);
    expect(spyOnGenerateLinearAssetFeatures).toBeCalledTimes(2);
    expect(spyOnGenerateLinearAssetFeatures).toHaveReturnedWith([]);
  });

  test("should generate selected linear asset features for selected assets which exist", async () => {
    const spyOnGenerateLinearAssetFeatures = vi.spyOn(
      mapboxFeatures,
      "generateLinearAssetFeatures"
    );
    const assets = await getCreatedAssets(
      TRANSPORT_ASSETS,
      ["T043", "T020"],
      vi.fn(),
      vi
        .fn()
        .mockReturnValueOnce(T034_SEGMENTS)
        .mockReturnValueOnce(T020_SEGMENTS)
        .mockReturnValue([])
    );
    const { rerender } = renderWithQueryClient(
      <MapComponent assets={assets} selectedElements={assets} />
    );

    let results = spyOnGenerateLinearAssetFeatures.mock.results[0].value;

    expect(spyOnGenerateLinearAssetFeatures).toBeCalledTimes(1);
    expect(results).toHaveLength(2);
    expect(results[0].properties.selected).toBe(true);
    expect(results[1].properties.selected).toBe(true);

    const filteredAssets = assets.filter((asset) => {
      const typeFilter = "http://ies.example.com/ontology/ies#ShippingComplex";
      const isShippingComplex = asset.type === typeFilter;
      return isShippingComplex;
    });
    rerender(<MapComponent assets={filteredAssets} selectedElements={assets} />);
    results = spyOnGenerateLinearAssetFeatures.mock.results[1].value;

    expect(spyOnGenerateLinearAssetFeatures).toBeCalledTimes(2);
    expect(results).toHaveLength(1);
    expect(results[0].properties.selected).toBe(true);
  });
});
