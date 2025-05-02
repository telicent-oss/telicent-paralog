import { HttpResponse } from "msw";

const typeStyles = {
  "http://ies.example.com/ontology/ies#LargeWindFarm": {
    defaultStyles: {
      dark: {
        backgroundColor: "#FFFF00",
        color: "black",
      },
      light: {
        backgroundColor: "#FFFF00",
        color: "black",
      },
    },
    defaultIcons: {
      icon: "ri-cloudy-fill",
      faIcon: "fa-solid fa-utility-pole-double",
      faUnicode: "",
      faClass: "fa-solid",
    },
  },
  "http://ies.example.com/ontology/ies#CoalPlantComplex": {
    defaultStyles: {
      dark: {
        backgroundColor: "#FFFF00",
        color: "black",
      },
      light: {
        backgroundColor: "#FFFF00",
        color: "black",
      },
    },
    defaultIcons: {
      icon: "ri-cloudy-fill",
      faIcon: "fa-regular fa-bolt-lightning",
      faUnicode: "",
      faClass: "fa-regular",
    },
  },
};

const iconStyles = (req, res, ctx) => {
  const url = new URL(req.request.url);
  const uri = url.searchParams.get("uri");
  const style = typeStyles[uri];
  if (style) return res(ctx.status(200), ctx.json({ [uri]: style }));
  return HttpResponse.json(
    { detail: `Icon style for ${uri} not found` },
    { status: 404 },
  );
};

export default iconStyles;
