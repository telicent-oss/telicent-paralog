import { isEmpty } from "lodash";
import { HttpResponse } from "msw";

export const R013_RESIDENTS = [
  {
    uri: "https://www.example.com/Instruments#V013",
    name: "Mrs Martha Clark",
  },
];

const residents = (req) => {
  const url = new URL(req.request.url);
  const assetUri = url.searchParams.get("assetUri");
  let residents = [];

  if (assetUri === "https://www.example.com/Instruments#R013") {
    residents = R013_RESIDENTS;
  }
  if (isEmpty(residents)) {
    return HttpResponse.json(`Resident information for ${assetUri} not found`, {
      status: 404,
    });
  }
  return HttpResponse.json(residents, { status: 200 });
};
export default residents;
