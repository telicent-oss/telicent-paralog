import { HttpResponse } from "msw";

const allFloodAreas = (req, res, ctx) => {
  return HttpResponse.json(
    [
      {
        uri: "http://environment.data.gov.uk/flood-monitoring/id/floodAreas/123ABC456",
        name: "American",
        polygon_uri:
          "http://environment.data.gov.uk/flood-monitoring/id/floodAreas/123ABC456/polygon",
        flood_areas: [
          {
            uri: "http://environment.data.gov.uk/flood-monitoring/id/floodAreas/123ABC102",
            name: "Seal bay, Newland, and Seddon on the American",
            polygon_uri:
              "http://environment.data.gov.uk/flood-monitoring/id/floodAreas/123ABC102/polygon",
          },
          {
            uri: "http://environment.data.gov.uk/flood-monitoring/id/floodAreas/123ABC101",
            name: "Blackwell, Bordertown, Minipa, Bridgehaven on the American",
            polygon_uri:
              "http://environment.data.gov.uk/flood-monitoring/id/floodAreas/123ABC101/polygon",
          },
        ],
      },
    ],
    { status: 200 },
  );
};
export default allFloodAreas;
