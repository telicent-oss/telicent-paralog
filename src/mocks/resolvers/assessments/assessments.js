import { ASSESSMENTS } from "mocks/data";
import { HttpResponse } from "msw";

const assessments = () => {
  return HttpResponse.json(ASSESSMENTS, { status: 200 });
};
export default assessments;

