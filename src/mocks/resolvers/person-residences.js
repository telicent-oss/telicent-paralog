import { isEmpty } from "lodash";
import { HttpResponse } from "msw";

export const V013_RESIDENCES = [
  {
    uri: "https://www.example.com/Instruments#R013",
    assetType: "http://ies.example.com/ontology/ies#ResidentialBuilding",
    name: null,
    lat: 55.123,
    lon: -55.345,
    address: "1 Daft Rd, Saltdean, BN51",
    desc: null,
    osmID: null,
    wikipediaPage: null,
    webPage: null,
    dependentCount: null,
    dependentCriticalitySum: null,
  },
];

const personResidences = (req, res, ctx) => {
  const url = new URL(req.request.url);
  const personUri = url.searchParams.get("personUri");
  let residences = [];

  if (personUri === "https://www.example.com/Instruments%23V013") {
    residences = V013_RESIDENCES;
  }
  if (isEmpty(residences)) {
    return HttpResponse.json(`Residences for ${personUri} not found`, {
      status: 404,
    });
  }
  return HttpResponse.json(residences, { status: 200 });
};
export default personResidences;
