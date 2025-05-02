import { ASSESSMENTS, WOW_ASSET_TYPES } from "mocks/data";
import { HttpResponse } from "msw";

const assetTypes = (req) => {
  const url = new URL(req.request.url);
  let types = [];
  const assessment = url.searchParams.get("assessment");

  if (assessment === "https://www.example.com/Instruments#wowAssessment") {
    types = WOW_ASSET_TYPES;
  }
  return HttpResponse.json(types, { status: 200 });
};
export default assetTypes;
