import { http, HttpResponse } from "msw";
import { screen, waitForElementToBeRemoved, within } from "@testing-library/react";

import { renderWithQueryClient } from "test-utils";
import { server } from "mocks";
import { createParalogEndpoint } from "api/combined";
import { V013_RESIDENCES } from "mocks/resolvers/person-residences";

import ResidentialInformation from "../ResidentialInformation";

const waitForResidencesToLoad = async () => {
  await waitForElementToBeRemoved(() => screen.queryByText("Fetching residential addresses"));
};

describe("Residential information component", () => {
  test("does NOT render when element is not an asset", () => {
    const { container } = renderWithQueryClient(<ResidentialInformation isAsset={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  test("does NOT render when primaryType is not defined", () => {
    const { container } = renderWithQueryClient(
      <ResidentialInformation isAsset uri="https://www.example.com/Instruments%23V013" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("does NOT render when uri is not defined", () => {
    const { container } = renderWithQueryClient(
      <ResidentialInformation isAsset primaryType="Person" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("does NOT render when primaryType is not person", () => {
    const { container } = renderWithQueryClient(
      <ResidentialInformation isAsset primaryType="Road" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders residences address", async () => {
    renderWithQueryClient(
      <ResidentialInformation
        isAsset
        primaryType="person"
        uri="https://www.example.com/Instruments%23V013"
      />
    );

    expect(
      screen.getByRole("heading", { name: "Residential Information", level: 3 })
    ).toBeInTheDocument();
    await waitForResidencesToLoad();

    const addresses = screen.getAllByRole("listitem");
    expect(addresses).toHaveLength(1);
    expect(within(addresses[0]).getByText("Address 1")).toBeInTheDocument();
    expect(
      within(addresses[0]).getByText("1 Daft Rd, Saltdean, BN51")
    ).toBeInTheDocument();
  });

  test("limits addresses displayed", async () => {
    server.use(
      http.get(createParalogEndpoint("person/residences"), (req, res, ctx) => {
        const url = new URL(req.request.url);
        const personUri = url.searchParams.get("personUri");
        if (personUri === "https://www.example.com/Instruments%23V013") {
          return HttpResponse.json([
            ...V013_RESIDENCES,
            {
              uri: "https://www.example.com/Instruments#RT01",
              assetType: "http://ies.example.com/ontology/ies#ResidentialBuilding",
              address: "1 Telicent Rd, Freshwater, TO01 ABC",
            },
            {
              uri: "https://www.example.com/Instruments#RT02",
              assetType: "http://ies.example.com/ontology/ies#ResidentialBuilding",
              address: "2 Telicent Rd, Freshwater, T002 DEF",
            },
            {
              uri: "https://www.example.com/Instruments#RT03",
              assetType: "http://ies.example.com/ontology/ies#ResidentialBuilding",
              address: "3 Telicent Rd, Freshwater, T003 GHI",
            },
          ], { status: 200 })
        }
      })
    );
    const { user } = renderWithQueryClient(
      <ResidentialInformation
        isAsset
        primaryType="person"
        uri="https://www.example.com/Instruments%23V013"
      />
    );
    expect(
      screen.getByRole("heading", { name: "Residential Information", level: 3 })
    ).toBeInTheDocument();
    await waitForResidencesToLoad();

    expect(screen.getByText("4 addresses found")).toBeInTheDocument();
    const showAllAddressesBtn = screen.getByRole("button", { name: "show all addresses" });
    expect(showAllAddressesBtn).toBeInTheDocument();

    let addresses = screen.getAllByRole("listitem");
    expect(addresses).toHaveLength(3);

    expect(within(addresses[0]).getByText("Address 1")).toBeInTheDocument();
    expect(
      within(addresses[0]).getByText("1 Daft Rd, Saltdean, BN51")
    ).toBeInTheDocument();

    expect(within(addresses[1]).getByText("Address 2")).toBeInTheDocument();
    expect(
      within(addresses[1]).getByText("1 Telicent Rd, Freshwater, TO01 ABC")
    ).toBeInTheDocument();

    expect(within(addresses[2]).getByText("Address 3")).toBeInTheDocument();
    expect(
      within(addresses[2]).getByText("2 Telicent Rd, Freshwater, T002 DEF")
    ).toBeInTheDocument();

    // show all addresses
    await user.click(showAllAddressesBtn);

    addresses = screen.getAllByRole("listitem");
    expect(addresses).toHaveLength(4);

    expect(within(addresses[3]).getByText("Address 4")).toBeInTheDocument();
    expect(
      within(addresses[3]).getByText("3 Telicent Rd, Freshwater, T003 GHI")
    ).toBeInTheDocument();

    // show fewer addresses
    await user.click(screen.getByRole("button", { name: "show fewer addresses" }));
    addresses = screen.getAllByRole("listitem");
    expect(addresses).toHaveLength(3);
  });

  test("renders error message when addresses cannot be found", async () => {
    renderWithQueryClient(
      <ResidentialInformation
        isAsset
        primaryType="person"
        uri="https://www.wow.gov.uk/TelicentTesting%23V013"
      />
    );

    expect(
      screen.getByRole("heading", { name: "Residential Information", level: 3 })
    ).toBeInTheDocument();
    await waitForResidencesToLoad();

    expect(
      screen.getByText("An error occurred while retrieving residential information")
    ).toBeInTheDocument();
  });

  // Adding this test because currently the api does not return a 404 when an address cannot be found
  test("renders message when addresses are not found", async () => {
    server.use(
      http.get(createParalogEndpoint("person/residences"), (req, res, ctx) => {
        const url = new URL(req.request.url);
        const personUri = url.searchParams.get("personUri");
        if (personUri === "https://www.example.com/Instruments%23V013") {
          return HttpResponse.json([], { status: 200 });
        }
      })
    );
    renderWithQueryClient(
      <ResidentialInformation
        isAsset
        primaryType="person"
        uri="https://www.example.com/Instruments%23V013"
      />
    );
    expect(
      screen.getByRole("heading", { name: "Residential Information", level: 3 })
    ).toBeInTheDocument();
    await waitForResidencesToLoad();

    expect(screen.getByText("Residential information not found")).toBeInTheDocument();
  });

  test("renders uri when address key is not in data", async () => {
    const data = { ...V013_RESIDENCES[0] };
    delete data.address;
    server.use(
      http.get(createParalogEndpoint("person/residences"), (req, res, ctx) => {
        const url = new URL(req.request.url);
        const personUri = url.searchParams.get("personUri");
        if (personUri === "https://www.example.com/Instruments%23V013") {
          return HttpResponse.json([data], { status: 200 });
        }
      })
    );

    renderWithQueryClient(
      <ResidentialInformation
        isAsset
        primaryType="person"
        uri="https://www.example.com/Instruments%23V013"
      />
    );
    expect(
      screen.getByRole("heading", { name: "Residential Information", level: 3 })
    ).toBeInTheDocument();
    await waitForResidencesToLoad();

    let addresses = screen.getAllByRole("listitem");
    expect(addresses).toHaveLength(1);

    expect(within(addresses[0]).getByText("Address 1")).toBeInTheDocument();
    expect(
      within(addresses[0]).getByText("https://www.example.com/Instruments#R013")
    ).toBeInTheDocument();
  });
});
