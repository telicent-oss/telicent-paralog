import { createParalogEndpoint, fetchOptions } from "./utils";

export const fetchTypeSuperclass = async (typeUri) => {
  const queryParams = new URLSearchParams({ classUri: typeUri }).toString();
  const response = await fetch(
    createParalogEndpoint(`ontology/class?${queryParams}`),
    fetchOptions
  );
  if (!response.ok) {
    return {};
  }
  return response.json();
};

export const fetchResidentialInformation = async (personUri) => {
  const queryParams = new URLSearchParams({ personUri }).toString();
  const response = await fetch(
    createParalogEndpoint(`person/residences?${queryParams}`),
    fetchOptions
  );
  if (!response.ok) {
    throw new Error("An error occurred while retrieving residential information");
  }
  return response.json();
};

export const fetchFloodTimeline = async (floodArea) => {
  const queryParam = new URLSearchParams({
    parent_uri: `http://environment.data.gov.uk/flood-monitoring/id/floodAreas/${floodArea}`,
  }).toString();
  const response = await fetch(createParalogEndpoint(`states?${queryParam}`), fetchOptions);

  if (!response.ok) {
    throw new Error(`An error occurred while retrieving flood timeline for Flood Area ${floodArea}`);
  }

  return response.json();
};

export const fetchFloodMonitoringStations = async () => {
  const response = await fetch(
    "https://environment.data.gov.uk/flood-monitoring/id/stations?catchmentName=Kangaroo%20Island"
  );

  if (!response.ok) {
    throw new Error(
      "An error occurred while retrieving flood monitoring stations for the Kangaroo Island"
    );
  }
  return response.json();
};

export const fetchBuildingsEpcRating = async () => {
  const response = await fetch(createParalogEndpoint("buildings"));

  if (!response.ok) {
    throw new Error("An error occurred while retrieving building epc ratings for the Kangaroo Island");
  }
  return response.json();
};
