const floodAreaPolygons = (req, res, ctx) => {
  const polygonUri = req.url.searchParams.getAll("polygon_uri");
  let featureCollection = undefined;

  if (
    polygonUri.includes(
      "http://environment.data.gov.uk/flood-monitoring/id/floodAreas/123ABC456/polygon"
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

  if (featureCollection) return res(ctx.status(200), ctx.json(featureCollection));
  return res(ctx.status(404), ctx.json({ detail: `Polygon ${polygonUri} is not found` }));
};
export default floodAreaPolygons;
