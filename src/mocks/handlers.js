import { http } from "msw";

import {
  createOntologyServiceEndpoint,
  createParalogEndpoint,
} from "api/combined";
import {
  ASSESSMENTS_ASSETS_ENDPOINT,
  ASSESSMENTS_DEPENDENCIES_ENDPOINT,
} from "constants/endpoints";

import * as resolvers from "./resolvers";

export const handlers = [
  http.get(createParalogEndpoint("assessments"), resolvers.assessments),
  http.get(
    createParalogEndpoint("assessments/asset-types"),
    resolvers.assetTypes,
  ),
  http.get(ASSESSMENTS_ASSETS_ENDPOINT, resolvers.mockEmptyResponse),
  http.get(ASSESSMENTS_DEPENDENCIES_ENDPOINT, resolvers.mockEmptyResponse),
  http.get(createParalogEndpoint("asset"), resolvers.asset),
  http.get(createParalogEndpoint("asset/dependents"), resolvers.dependents),
  http.get(createParalogEndpoint("asset/providers"), resolvers.providers),
  http.get(createParalogEndpoint("asset/residents"), resolvers.residents),
  http.get(createParalogEndpoint("flood-watch-areas"), resolvers.allFloodAreas),
  http.get(
    createParalogEndpoint("flood-watch-areas/polygon"),
    resolvers.floodAreaPolygons,
  ),
  http.get(
    createParalogEndpoint("person/residences"),
    resolvers.personResidences,
  ),
  http.get(createParalogEndpoint("ontology/class"), resolvers.ontologyClass),
  http.get(
    createOntologyServiceEndpoint("ontology/query"),
    resolvers.ontologyStyles,
  ),
  http.all("*", (req, res, ctx) => {
    console.warn("[MSW] Unhandled request to:", req.url.href);
    return res(ctx.status(500));
  }),
];
