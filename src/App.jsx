import React, { useState } from "react";
import { DSProviders, TeliStandardLayout } from "@telicent-oss/ds";
import OntologyService from "@telicent-oss/ontologyservice";

import { DatasetProvider } from "context";
import { Dataset, Grid, InfoPanel, NetworkGraph, SponsorsLogos, TelicentMap } from "./components";
import FloodZoneTimeline from "components/Map/FloodZoneTimeline";
import config from "./config/app-config";
import { ErrorNotification, ResizableContainer } from "./lib";

import "@telicent-oss/ds/dist/fontawesome.css";
import "@telicent-oss/ds/dist/style.css";
import { APP_CONFIG_JSON } from "./constants";

const ontologyService = new OntologyService(config.services.ontology, "/ontology");

const App = () => {
  const [showGrid, setShowGrid] = useState(false);

  const toggleView = () => {
    setShowGrid((prevShow) => !prevShow);
  };

  if (!config && !config.api && !config.api.url) {
    console.error("Missing configuration");
  }

  return (
    <DSProviders ontologyService={ontologyService}>
      <SponsorsLogos />
      <TeliStandardLayout appName={APP_CONFIG_JSON.app_name} beta={true}>
        <div className="relative h-full">
          <ErrorNotification />
          <InfoPanel />
          <DatasetProvider>
            <Dataset showGrid={showGrid} toggleView={toggleView} />
            <div className="flex h-full gap-x-2">
              <ResizableContainer>
                <Grid showGrid={showGrid} />
                <NetworkGraph showGrid={showGrid} />
                <FloodZoneTimeline />
              </ResizableContainer>
              <TelicentMap />
            </div>
          </DatasetProvider>
        </div>
      </TeliStandardLayout>
    </DSProviders>
  );
};

export default App;
