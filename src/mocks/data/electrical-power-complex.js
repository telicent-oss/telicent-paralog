export const SMALL_WIND_FARM = [
  {
    uri: "https://www.example.com/Instruments#E014",
    type: "http://ies.example.com/ontology/ies#SmallWindFarm",
    lat: 1.3,
    lon: 2.4,
    dependentCount: 1,
    dependentCriticalitySum: 2,
    partCount: 3,
  },
];

export const LARGE_WIND_FARM_ASSETS = [
  {
    uri: "https://www.example.com/Instruments#E003",
    type: "http://ies.example.com/ontology/ies#LargeWindFarm",
    lat: 1.111111,
    lon: -1231231,
    dependentCount: 1,
    dependentCriticalitySum: 2,
    partCount: 3,
  },
  {
    uri: "https://www.example.com/Instruments#E025",
    type: "http://ies.example.com/ontology/ies#LargeWindFarm",
    lat: 1.555555,
    lon: 100.098765,
    dependentCount: 1,
    dependentCriticalitySum: 2,
    partCount: 3,
  },
];

export const COAL_PLANT_COMPLEX_ASSETS = [
  {
    uri: "https://www.example.com/Instruments#E001",
    type: "http://ies.example.com/ontology/ies#CoalPlantComplex",
    lat: 100.123123,
    lon: 10.1233333,
    dependentCount: 1,
    dependentCriticalitySum: 1,
    partCount: 0,
  },
];

export const LARGE_WIND_FARMS_AND_COAL_PLANT_COMPLEX_DEPENDENCIES =
  [
    {
      dependencyUri: "https://www.example.com/Instruments#_E026_E025_dependency",
      providerNode: "https://www.example.com/Instruments#E025",
      providerNodeType:
        "http://ies.example.com/ontology/ies#LargeWindFarm",
      providerName: null,
      dependentNode: "https://www.example.com/Instruments#E026",
      dependentNodeType:
        "http://ies.example.com/ontology/ies#LargeWindFarm",
      dependentName: null,
      criticalityRating: 1,
      osmID: null,
    },
    {
      dependencyUri: "https://www.example.com/Instruments#_E001_E003_dependency",
      providerNode: "https://www.example.com/Instruments#E003",
      providerNodeType:
        "http://ies.example.com/ontology/ies#LargeWindFarm",
      providerName: null,
      dependentNode: "https://www.example.com/Instruments#E001",
      dependentNodeType: "http://ies.example.com/ontology/ies#CoalPlantComplex",
      dependentName: null,
      criticalityRating: 2,
      osmID: null,
    },
    {
      dependencyUri: "https://www.example.com/Instruments#_E003_E001_dependency",
      providerNode: "https://www.example.com/Instruments#E001",
      providerNodeType: "http://ies.example.com/ontology/ies#CoalPlantComplex",
      providerName: null,
      dependentNode: "https://www.example.com/Instruments#E003",
      dependentNodeType:
        "http://ies.example.com/ontology/ies#LargeWindFarm",
      dependentName: null,
      criticalityRating: 3,
      osmID: null,
    },
    {
      dependencyUri: "https://www.example.com/Instruments#_E003_E025_dependency",
      providerNode: "https://www.example.com/Instruments#E025",
      providerNodeType:
        "http://ies.example.com/ontology/ies#LargeWindFarm",
      providerName: null,
      dependentNode: "https://www.example.com/Instruments#E003",
      dependentNodeType:
        "http://ies.example.com/ontology/ies#LargeWindFarm",
      dependentName: null,
      criticalityRating: 1,
      osmID: null,
    },
    {
      dependencyUri: "https://www.example.com/Instruments#_E004_E025_dependency",
      providerNode: "https://www.example.com/Instruments#E025",
      providerNodeType:
        "http://ies.example.com/ontology/ies#LargeWindFarm",
      providerName: null,
      dependentNode: "https://www.example.com/Instruments#E004",
      dependentNodeType:
        "http://ies.example.com/ontology/ies#LargeWindFarm",
      dependentName: null,
      criticalityRating: 2,
      osmID: null,
    },
  ];
