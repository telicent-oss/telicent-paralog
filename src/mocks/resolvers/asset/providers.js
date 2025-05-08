import { HttpResponse } from "msw";

const mockedProviders = [
  {
    dependencyUri: "https://www.example.com/Instruments#_E001_E003_dependency",
    providerNode: "https://www.example.com/Instruments#E003",
    providerNodeType: "http://ies.example.com/ontology/ies#LargeWindFarm",
    providerName: "West Coleman 50kV Substation",
    dependentNode: "https://www.example.com/Instruments#E001",
    dependentNodeType: "http://ies.example.com/ontology/ies#CoalPlantComplex",
    dependentName: "Best Coleman Power Station",
    criticalityRating: 3,
    osmID: null,
  },
  {
    dependencyUri: "https://www.example.com/Instruments#_E003_E025_dependency",
    providerNode: "https://www.example.com/Instruments#E025",
    providerNodeType: "http://ies.example.com/ontology/ies#LargeWindFarm",
    providerName: "Hawk 123 kV Substation - Hands",
    dependentNode: "https://www.example.com/Instruments#E003",
    dependentNodeType: "http://ies.example.com/ontology/ies#LargeWindFarm",
    dependentName: "West Coleman 50kV Substation",
    criticalityRating: 3,
    osmID: null,
  },
  {
    dependencyUri: "https://www.example.com/Instruments#_E003_E001_dependency",
    providerNode: "https://www.example.com/Instruments#E001",
    providerNodeType: "http://ies.example.com/ontology/ies#CoalPlantComplex",
    providerName: "Best Coleman Power Station",
    dependentNode: "https://www.example.com/Instruments#E003",
    dependentNodeType: "http://ies.example.com/ontology/ies#LargeWindFarm",
    dependentName: "West Coleman 50kV Substation",
    criticalityRating: 3,
    osmID: null,
  },
];

const providers = (req) => {
  const url = new URL(req.request.url);
  const assetUri = url.searchParams.get("assetUri");
  const providers = mockedProviders.filter(
    (mockedProvider) => mockedProvider.dependentNode === assetUri,
  );

  if (providers) return HttpResponse.json(providers, { status: 200 });
  return HttpResponse.json(
    { detail: `Details for ${assetUri} not found` },
    { status: 404 },
  );
};

export default providers;
