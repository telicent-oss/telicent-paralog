import { ASSESSMENTS, WOW_ASSET_TYPES } from "mocks/data";

const assetTypes = (req, res, ctx) => {
  let types = [];
  const assessment = req.url.searchParams.get("assessment");

  if (assessment === "https://www.example.com/Instruments#wowAssessment") {
    types = WOW_ASSET_TYPES;
  }
  return res(ctx.status(200), ctx.json(types));
};
export default assetTypes;
