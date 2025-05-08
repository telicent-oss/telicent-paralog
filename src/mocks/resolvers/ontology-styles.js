import { HttpResponse } from "msw";

const styles = [
  {
    cls: {
      type: "uri",
      value: "http://ies.example.com/ontology/ies#LargeWindFarm",
    },
    style: {
      type: "literal",
      value:
        '{"defaultStyles": {"dark": {"backgroundColor": "#242400", "color": "#FFFD04"}, "light": {"backgroundColor": "#FFFD04", "color": "#242400"}, "shape": "circle", "borderRadius": "9999px", "borderWidth": "2px", "selectedBorderWidth": "3px"}, "defaultIcons": {"riIcon": "ri-cloudy-fill", "faIcon": "fa-solid fa-utility-pole-double", "faUnicode": "\\ue2c4", "faClass": "fa-solid"}}',
    },
  },
  {
    cls: {
      type: "uri",
      value: "http://ies.example.com/ontology/ies#CoalPlantComplex",
    },
    style: {
      type: "literal",
      value:
        '{"defaultStyles": {"dark": {"backgroundColor": "#242400", "color": "#FFFD04"}, "light": {"backgroundColor": "#FFFD04", "color": "#242400"}, "shape": "circle", "borderRadius": "9999px", "borderWidth": "2px", "selectedBorderWidth": "3px"}, "defaultIcons": {"riIcon": "ri-cloudy-fill", "faIcon": "fa-regular fa-bolt-lightning", "faUnicode": "\\ue0b7", "faClass": "fa-regular"}}',
    },
  },
  {
    cls: {
      type: "uri",
      value: "http://ies.example.com/ontology/ies#SmallWindFarm",
    },
    style: {
      type: "literal",
      value:
        '{"defaultStyles": {"dark": {"backgroundColor": "#242400", "color": "#FFFD04"}, "light": {"backgroundColor": "#FFFD04", "color": "#242400"}, "shape": "circle", "borderRadius": "9999px", "borderWidth": "2px", "selectedBorderWidth": "3px"}, "defaultIcons": {"riIcon": "ri-cloudy-fill", "faIcon": "fa-solid fa-utility-pole", "faUnicode": "\\ue0b7", "faClass": "fa-solid"}}',
    },
  },
];

const ontologyClass = (req, res, ctx) => {
  return HttpResponse.json(
    {
      head: {
        vars: ["cls", "style"],
      },
      results: {
        bindings: styles,
      },
    },
    { status: 200 },
  );
};

export default ontologyClass;
