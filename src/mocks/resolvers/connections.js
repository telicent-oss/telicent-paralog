import { HttpResponse } from "msw";
import {
  ENERGY_CONNECTIONS,
  MEDICAL_CONNECTIONS,
  TRANSPORT_CONNECTIONS,
} from "../data";

const connections = (req) => {
  const url = new URL(req.request.url);
  const assessments = url.searchParams.getAll("assessments");

  const connections = [];
  if (assessments.includes("http://telicent.io/fake_data#Energy_Assessment")) {
    connections.push(...ENERGY_CONNECTIONS);
  }
  if (assessments.includes("http://telicent.io/fake_data#Medical_Assessment")) {
    connections.push(...MEDICAL_CONNECTIONS);
  }
  if (
    assessments.includes("http://telicent.io/fake_data#Transport_Assessment")
  ) {
    connections.push(...TRANSPORT_CONNECTIONS);
  }
  return HttpResponse.json(connections);
};

export default connections;
