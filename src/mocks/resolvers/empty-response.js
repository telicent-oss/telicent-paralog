import { HttpResponse } from "msw";

const mockEmptyResponse = (req, res, ctx) =>
  HttpResponse.json([], { status: 200 });
export default mockEmptyResponse;

