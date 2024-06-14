import React, { useContext } from "react";
import CheckboxTree from "react-checkbox-tree";

import { DatasetContext } from "context";
import { useFloodWatchAreas } from "hooks";

import "react-checkbox-tree/lib/react-checkbox-tree.css";
import "./react-checkbox-tree.css";

const FloodAreas = () => {
  const {
    expandedFloodAreas,
    selectedFloodAreas,
    addSelectedFloodAreas,
    updateExpandedFloodAreas,
  } = useContext(DatasetContext);
  const { isLoading, isError, error, data: floodAreaNodes } = useFloodWatchAreas();

  if (isLoading) return <p>Fetching flood areas</p>;
  if (isError) return <p>{error.message}</p>;

  const onCheck = async (checked) => {
    addSelectedFloodAreas(checked);
  };

  return (
    <CheckboxTree
      nodes={floodAreaNodes}
      checked={selectedFloodAreas}
      expanded={expandedFloodAreas}
      onCheck={onCheck}
      onExpand={(expanded) => updateExpandedFloodAreas(expanded)}
      checkModel="all"
      showNodeIcon={false}
      noCascade
    />
  );
};

export default FloodAreas;
