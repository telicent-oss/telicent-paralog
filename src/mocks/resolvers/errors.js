import { HttpResponse } from "msw";

const mock400Error = (req, res, ctx) =>
  HttpResponse.json({ message: "an error has occurred" }, { status: 400 });

export default mock400Error;

