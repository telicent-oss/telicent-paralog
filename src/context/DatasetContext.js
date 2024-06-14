import { createContext, useState } from "react";

const DatasetContext = createContext();

const DatasetProvider = ({ children }) => {
  const [selectedFloodAreas, setSelectedFloodAreas] = useState([]);
  const [expandedFloodAreas, setExpandedFloodAreas] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [expandedAssets, setExpandedAssets] = useState([]);

  const addSelectedFloodAreas = (polygonUris) => {
    setSelectedFloodAreas(polygonUris);
  };

  const addSelectedAssets = (assets) => {
    console.log({ assets });
    setSelectedAssets(assets);
  };

  const removeSelectedAsset = (selectedAsset) => {
    setSelectedAssets((assets) => assets.filter((asset) => asset !== selectedAsset));
  };

  const toggleExpandedAssets = (selectedGroup) => {
    const index = expandedAssets.findIndex((ontologyGroup) => ontologyGroup === selectedGroup);
    if (index === -1) {
      setExpandedAssets([...expandedAssets, selectedGroup]);
      return;
    }
    const filteredGroups = expandedAssets.filter(
      (ontologyGroup) => ontologyGroup !== selectedGroup
    );
    setExpandedAssets(filteredGroups);
  };

  const updateExpandedFloodAreas = (groups) => {
    setExpandedFloodAreas(groups);
  };

  return (
    <DatasetContext.Provider
      value={{
        expandedAssets,
        expandedFloodAreas,
        selectedFloodAreas,
        selectedAssets,
        addSelectedAssets,
        addSelectedFloodAreas,
        removeSelectedAsset,
        toggleExpandedAssets,
        updateExpandedFloodAreas,
      }}
    >
      {children}
    </DatasetContext.Provider>
  );
};

export { DatasetContext, DatasetProvider };
