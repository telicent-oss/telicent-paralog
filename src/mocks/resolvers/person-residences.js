import { isEmpty } from "lodash";

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
  const personUri = req.url.searchParams.get("personUri");
  let residences = [];

  if (personUri === "https://www.example.com/Instruments%23V013") {
    residences = V013_RESIDENCES;
  }
  if (isEmpty(residences)) {
    return res(ctx.status(404), ctx.json(`Residences for ${personUri} not found`));
  }
  return res(ctx.status(200), ctx.json(residences));
};
export default personResidences;
