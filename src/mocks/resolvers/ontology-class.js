const SUPER_CLASSES = {
  "http://ies.example.com/ontology/ies#SewerPlant": {
    superClass: ["http://ies.example.com/ontology/ies#WastewaterComplex"],
  },
  "http://ies.example.com/ontology/ies#DesalinationPlant": {
    superClass: ["http://ies.example.com/ontology/ies#Facility"],
  },
  "http://ies.example.com/ontology/ies#Road": {
    superClass: ["http://ies.example.com/ontology/ies#Facility"],
  },
  "http://ies.example.com/ontology/ies#PhoneBox": {
    superClass: ["http://ies.example.com/ontology/ies#Facility"],
  },
  "http://ies.example.com/ontology/ies#FireHydrantComplex": {
    superClass: ["http://ies.example.com/ontology/ies#Facility"],
  },
  "http://ies.example.com/ontology/ies#SmallWindFarm": {
    superClass: ["http://ies.example.com/ontology/ies#GreenGrid"],
  },
  "http://ies.example.com/ontology/ies#LargeWindFarm": {
    superClass: ["http://ies.example.com/ontology/ies#GreenGrid"],
  },
};

const ontologyClass = (req, res, ctx) => {
  const classUri = req.url.searchParams.get("classUri");

  const superClass = SUPER_CLASSES[classUri];
  if (superClass) return res(ctx.status(200), ctx.json({ [classUri]: SUPER_CLASSES[classUri] }));
  return res(ctx.status(404), ctx.json({ detail: `Could not retrieve class for ${classUri}` }));
};

export default ontologyClass;
