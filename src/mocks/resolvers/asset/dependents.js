const mockedDependents = [
  {
    dependencyUri: "https://www.example.com/Instruments#_E003_E001_dependency",
    providerNode: "https://www.example.com/Instruments#E001",
    providerNodeType: "http://ies.example.com/ontology/ies#CoalPlantComplex",
    providerName: "Best Coleman Power Station",
    dependentNode: "https://www.example.com/Instruments#E003",
    dependentNodeType:
      "http://ies.example.com/ontology/ies#LargeWindFarm",
    dependentName: "West Coleman 50kV Substation",
    criticalityRating: 3,
    osmID: null,
  },
  {
    dependencyUri: "https://www.example.com/Instruments#_E008_E003_dependency",
    providerNode: "https://www.example.com/Instruments#E003",
    providerNodeType:
      "http://ies.example.com/ontology/ies#LargeWindFarm",
    providerName: "West Coleman 50kV Substation",
    dependentNode: "https://www.example.com/Instruments#E008",
    dependentNodeType:
      "http://ies.example.com/ontology/ies#SmallWindFarm",
    dependentName: "Jose 20kv Substation",
    criticalityRating: 3,
    osmID: null,
  },
  {
    dependencyUri: "https://www.example.com/Instruments#_E002_E003_dependency",
    providerNode: "https://www.example.com/Instruments#E003",
    providerNodeType:
      "http://ies.example.com/ontology/ies#LargeWindFarm",
    providerName: "West Coleman 50kV Substation",
    dependentNode: "https://www.example.com/Instruments#E002",
    dependentNodeType:
      "http://ies.example.com/ontology/ies#SmallWindFarm",
    dependentName: "West Coleman 50kV Substation",
    criticalityRating: 3,
    osmID: null,
  },
  {
    dependencyUri: "https://www.example.com/Instruments#_E012_E003_dependency",
    providerNode: "https://www.example.com/Instruments#E003",
    providerNodeType:
      "http://ies.example.com/ontology/ies#LargeWindFarm",
    providerName: "West Coleman 50kV Substation",
    dependentNode: "https://www.example.com/Instruments#E012",
    dependentNodeType:
      "http://ies.example.com/ontology/ies#SmallWindFarm",
    dependentName: "Bluey 10kV Substation",
    criticalityRating: 3,
    osmID: null,
  },
  {
    dependencyUri: "https://www.example.com/Instruments#_E001_E003_dependency",
    providerNode: "https://www.example.com/Instruments#E003",
    providerNodeType:
      "http://ies.example.com/ontology/ies#LargeWindFarm",
    providerName: "West Coleman 50kV Substation",
    dependentNode: "https://www.example.com/Instruments#E001",
    dependentNodeType: "http://ies.example.com/ontology/ies#CoalPlantComplex",
    dependentName: "Best Coleman Power Station",
    criticalityRating: 3,
    osmID: null,
  },
];

const dependents = (req, res, ctx) => {
  const assetUri = req.url.searchParams.get("assetUri");

  const dependents = mockedDependents.filter((dependent) => dependent.providerNode === assetUri);
  if (dependents) return res(ctx.status(200), ctx.json(dependents));
  return res(ctx.status(404), ctx.json({ detail: `Details for ${assetUri} not found` }));
};

export default dependents;
