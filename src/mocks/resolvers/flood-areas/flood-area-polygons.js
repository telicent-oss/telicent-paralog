import { HttpResponse } from "msw";

const floodAreaPolygons = (req) => {
  const url = new URL(req.request.url);
  const polygonUri = url.searchParams.getAll("polygon_uri");
  let featureCollection = undefined;

  if (
    polygonUri.includes(
      "http://environment.data.gov.uk/flood-monitoring/id/floodAreas/123ABC456/polygon",
    )
  ) {
    featureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "MultiPolygon",
            coordinates: [["flood area 1"], ["flood area 2"]],
          },
          properties: {
            AREA: "Fanghorn and Downs",
            FWS_TACODE: "123ABC456",
            TA_NAME: "American",
            DESCRIP: "American and tributaries from Blackwell to Newland",
            LA_NAME: "Kangaroo Island",
            QDIAL: "123456",
            RIVER_SEA: "American",
          },
        },
      ],
      crs: null,
    };
  }

  if (featureCollection)
    return HttpResponse.json(featureCollection, { status: 200 });

  return HttpResponse.json(
    { detail: `Polygon ${polygonUri} is not found` },
    { status: 404 },
  );
};
export default floodAreaPolygons;
