import { waitFor } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react";
import { AMERICAN_FEATURE, SEAL_BAY_NEWLAND_AND_SEDDON_ON_AMERICAN } from "mocks";
import useMapInteractions from "../useMapInteractions";

const renderUseMapInteractionsHook = ({
  assets,
  dependencies,
  selectedElements,
  onElementClick,
  onAreaSelect,
  moveTo,
}) =>
  renderHook(() =>
    useMapInteractions({
      assets: assets ?? [],
      dependencies: dependencies ?? [],
      selectedElements: selectedElements ?? [],
      onElementClick: onElementClick ?? jest.fn(),
      onAreaSelect: onAreaSelect ?? jest.fn(),
      moveTo: moveTo ?? jest.fn(),
    })
  );

describe("useMapInteractions hook", () => {
  test("selectes flood zone", async () => {
    const { result } = renderUseMapInteractionsHook({});
    const mockEvent = {
      originalEvent: { stopPropagation: jest.fn() },
      target: {
        queryRenderedFeatures: jest.fn().mockReturnValue([AMERICAN_FEATURE]),
        setFeatureState: jest.fn(),
        getSource: jest.fn().mockReturnValue({ _data: { features: [] } }),
      },
      features: [AMERICAN_FEATURE],
    };

    act(() => {
      result.current.handleOnClick(mockEvent);
    });

    await waitFor(() => expect(result.current.selectedFloodZones).toHaveLength(1));
    expect(result.current.selectedFloodZones[0].properties.TA_NAME).toMatch(
      AMERICAN_FEATURE.properties.TA_NAME
    );
  });

  test("selectes all flood zones, parent and child", async () => {
    const { result } = renderUseMapInteractionsHook({});
    const mockEvent = {
      originalEvent: { stopPropagation: jest.fn() },
      target: {
        queryRenderedFeatures: jest
          .fn()
          .mockReturnValue([AMERICAN_FEATURE, SEAL_BAY_NEWLAND_AND_SEDDON_ON_AMERICAN]),
        setFeatureState: jest.fn(),
        getSource: jest.fn().mockReturnValue({ _data: { features: [] } }),
      },
      features: [AMERICAN_FEATURE, SEAL_BAY_NEWLAND_AND_SEDDON_ON_AMERICAN],
    };

    act(() => {
      result.current.handleOnClick(mockEvent);
    });

    await waitFor(() => expect(result.current.selectedFloodZones).toHaveLength(2));
    expect(result.current.selectedFloodZones[0].properties.TA_NAME).toMatch(
      AMERICAN_FEATURE.properties.TA_NAME
    );
    expect(result.current.selectedFloodZones[1].properties.TA_NAME).toMatch(
      SEAL_BAY_NEWLAND_AND_SEDDON_ON_AMERICAN.properties.TA_NAME
    );
  });
});
