const AMERICAN_FEATURE = {
  geometry: {
    type: "MultiPolygon",
    coordinates: [
      [
        [
          [53.0017, -25.2397],
          [53.0387, -25.2670],
          [53.0761, -25.3017],
          [53.1320, -25.3277],
          [53.1563, -25.3405],
          [53.1861, -25.3675],
          [53.2137, -25.3853],
          [53.2395, -25.3890],
          [53.2500, -25.3625],
          [53.2545, -25.3402],
          [53.2402, -25.3201],
          [53.2069, -25.2986],
          [53.1718, -25.2677],
          [53.1484, -25.2528],
          [53.1111, -25.2353],
          [53.0617, -25.2220],
          [53.0276, -25.2226],
          [53.0044, -25.2331],
          [53.0017, -25.2397]
        ],
      ],
      [
        [
          [43.8256, -39.9040],
          [43.8617, -39.9142],
          [43.8951, -39.9278],
          [43.9253, -39.9450],
          [43.9540, -39.9612],
          [43.9720, -39.9805],
          [43.9817, -40.0052],
          [43.9834, -40.0332],
          [43.9812, -40.0581],
          [43.9721, -40.0788],
          [43.9512, -40.0940],
          [43.9255, -40.1067],
          [43.8972, -40.1153],
          [43.8695, -40.1188],
          [43.8412, -40.1177],
          [43.8128, -40.1125],
          [43.7882, -40.1018],
          [43.7684, -40.0872],
          [43.7532, -40.0695],
          [43.7441, -40.0487],
          [43.7410, -40.0262],
          [43.7442, -40.0038],
          [43.7528, -39.9825],
          [43.7664, -39.9641],
          [43.7847, -39.9488],
          [43.8064, -39.9366],
          [43.8302, -39.9272],
          [43.8550, -39.9207],
          [43.8806, -39.9133],
          [43.9062, -39.9078],
          [43.8256, -39.9040]
        ],
      ],
    ],
  },
  type: "Feature",
  properties: {
    AREA: "Fanghorn and Downs",
    FWS_TACODE: "123ABC456",
    TA_NAME: "American",
    DESCRIP: "American and tributaries from Blackwell to Newland",
    LA_NAME: "Kangaroo Island",
    QDIAL: "123456",
    RIVER_SEA: "American",
  },
  id: 0,
  layer: {
    id: "flood-area-ploygon",
    type: "fill",
    source: "flood-areas",
    paint: {
      "fill-color": {
        r: 0.0196078431372549,
        g: 0.6196078431372549,
        b: 0.7529411764705882,
        a: 1,
      },
      "fill-opacity": 0.4,
    },
    layout: {},
  },
  source: "flood-areas",
  state: {},
};

export default AMERICAN_FEATURE;
