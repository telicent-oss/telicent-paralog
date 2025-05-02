import { screen, waitForElementToBeRemoved, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { server } from "mocks";
import { createParalogEndpoint } from "api/combined";
import { renderWithQueryClient } from "test-utils";
import { R013_RESIDENTS } from "mocks/resolvers/asset/residents";
import { mockEmptyResponse } from "mocks/resolvers";

import Residents from "../Residents";

const waitForResidentsToLoad = async () => {
  await waitForElementToBeRemoved(() => screen.queryByText("Fetching residents information"));
};

describe("Residents component", () => {
  test("does NOT render residents when elements is not an asset", () => {
    renderWithQueryClient(
      <Residents
        isAsset={false}
        assetUri="https://www.example.com/Instruments#R013"
        primaryType="ResidentialBuilding"
      />
    );
    expect(document.querySelector("body").firstElementChild).toBeEmptyDOMElement();
  });

  test("does NOT render residents when primaryType is undefined", () => {
    renderWithQueryClient(<Residents isAsset assetUri="https://www.example.com/Instruments#R013" />);
    expect(document.querySelector("body").firstElementChild).toBeEmptyDOMElement();
  });

  test("does NOT render residents when uri is undefined", () => {
    renderWithQueryClient(<Residents isAsset primaryType="ResidentialBuilding" />);
    expect(document.querySelector("body").firstElementChild).toBeEmptyDOMElement();
  });

  test("does NOT render residents when primary type has no residents", () => {
    renderWithQueryClient(<Residents isAsset primaryType="Road" />);
    expect(document.querySelector("body").firstElementChild).toBeEmptyDOMElement();
  });

  test("can be toggled", async () => {
    const { user } = renderWithQueryClient(
      <Residents
        isAsset
        assetUri="https://www.example.com/Instruments#R013"
        primaryType="ResidentialBuilding"
      />
    );
    await waitForResidentsToLoad();

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "1 resident" }));
    expect(screen.getByRole("list")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "1 resident" }));
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  test("renders residents", async () => {
    const { user } = renderWithQueryClient(
      <Residents
        isAsset
        assetUri="https://www.example.com/Instruments#R013"
        primaryType="ResidentialBuilding"
      />
    );
    await waitForResidentsToLoad();

    expect(screen.getByRole("heading", { name: "1 resident", level: 3 })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "1 resident" }));

    const residents = screen.getAllByRole("listitem");
    expect(residents).toHaveLength(1);

    expect(within(residents[0]).getByText("Mrs Martha Clark")).toBeInTheDocument();
  });

  test("renders more than one resident", async () => {
    server.use(
      http.get(createParalogEndpoint("asset/residents"), (req, res, ctx) => {
        const url = new URL(req.request.url);
        const assetUri = url.searchParams.get("assetUri");
        if (assetUri === "https://www.example.com/Instruments#R013") {
          return HttpResponse.json([
            ...R013_RESIDENTS,
            {
              uri: "https://www.wow.gov.uk/Testing#V003",
              name: "Mr Charles Berry",
            },
          ], { status: 200 })
        }
      })
    );

    const { user } = renderWithQueryClient(
      <Residents
        isAsset
        assetUri="https://www.example.com/Instruments#R013"
        primaryType="ResidentialBuilding"
      />
    );
    await waitForResidentsToLoad();

    expect(screen.getByRole("heading", { name: "2 residents", level: 3 })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "2 residents" }));

    const residents = screen.getAllByRole("listitem");
    expect(residents).toHaveLength(2);

    expect(within(residents[0]).getByText("Mrs Martha Clark")).toBeInTheDocument();
    expect(within(residents[1]).getByText("Mr Charles Berry")).toBeInTheDocument();
  });

  test("renders error message when resident(s) are not found", async () => {
    renderWithQueryClient(
      <Residents
        isAsset
        assetUri="https://www.wow.gov.uk/Testing#R013"
        primaryType="ResidentialBuilding"
      />
    );
    await waitForResidentsToLoad();
    expect(
      screen.getByText("Failed to retrieve residents for https://www.wow.gov.uk/Testing#R013")
    ).toBeInTheDocument();
  });

  // Adding this test because currently the api does not return a 404 when an address cannot be found
  test("does NOT render residents when none are found", async () => {
    server.use(http.get(createParalogEndpoint("asset/residents"), mockEmptyResponse));
    renderWithQueryClient(
      <Residents
        isAsset
        assetUri="https://www.example.com/Instruments#R013"
        primaryType="ResidentialBuilding"
      />
    );
    await waitForResidentsToLoad();
    expect(document.querySelector("body").firstElementChild).toBeEmptyDOMElement();
  });

  test("renders uri resident when name is not in data", async () => {
    const data = { ...R013_RESIDENTS[0] };
    delete data.name;
    server.use(
      http.get(createParalogEndpoint("asset/residents"), (req) => {
        const url = new URL(req.request.url);
        const assetUri = url.searchParams.get("assetUri");
        if (assetUri === "https://www.example.com/Instruments#R013") {
          return HttpResponse.json([data], { status: 200 });
        }
      })
    );

    const { user } = renderWithQueryClient(
      <Residents
        isAsset
        assetUri="https://www.example.com/Instruments#R013"
        primaryType="ResidentialBuilding"
      />
    );
    await waitForResidentsToLoad();
    await user.click(screen.getByRole("button", { name: "1 resident" }));

    const residents = screen.getAllByRole("listitem");
    expect(residents).toHaveLength(1);

    expect(
      within(residents[0]).getByText("https://www.example.com/Instruments#V013")
    ).toBeInTheDocument();
  });
});
