import { rest } from "msw";
import { screen, waitForElementToBeRemoved, within } from "@testing-library/react";

import { DatasetProvider, ElementsProvider } from "context";
import { createParalogEndpoint } from "api/combined";
import { ASSESSMENTS } from "mocks";
// import server, { ASSESSMENTS } from "mocks";
import { mockEmptyResponse, mock400Error } from "mocks/resolvers";
import { DSProvidersWrapper, renderWithQueryClient } from "test-utils";

import AssessmentTypes from "../AssessmentTypes";

const renderAssessmentTypes = () =>
  renderWithQueryClient(
    <DSProvidersWrapper>
      <DatasetProvider>
        <AssessmentTypes assessment={ASSESSMENTS[0].uri} />
      </DatasetProvider>
    </DSProvidersWrapper>,
    { wrapper: ElementsProvider }
  );

const waitForDataToLoad = async () => {
  await waitForElementToBeRemoved(() => screen.queryByText(/fetching data types/i));
};

describe("AssessmentTypes component", () => {
  test("renders grouped types", async () => {
    renderAssessmentTypes();
    await waitForDataToLoad();

    screen.logTestingPlaygroundURL()
    expect(
      screen.getByRole("button", { name: /Green grid/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Facility/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Wastewater complex/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Other/i })).toBeInTheDocument();
  });

  test("renders green grid types with total count", async () => {
    const { user } = renderAssessmentTypes();
    await waitForDataToLoad();

    await user.click(screen.getByRole("button", { name: "Green grid" }));
    const greenGridListItems = within(
      screen.getByRole("treeitem", {
        name: /Green Grid/i,
        expanded: true,
      })
    ).getAllByRole("listitem");

    expect(
      within(greenGridListItems[0]).getByLabelText(
        /large wind farm \[8\]/i
      )
    ).toBeInTheDocument();
    expect(
      within(greenGridListItems[1]).getByLabelText(
        /small wind farm \[9\]/i
      )
    ).toBeInTheDocument();
  });

  test("renders other types with total count", async () => {
    const { user } = renderAssessmentTypes();
    await waitForDataToLoad();

    await user.click(screen.getByRole("button", { name: "Other" }));
    const otherListItems = within(
      screen.getByRole("treeitem", {
        name: /other/i,
        expanded: true,
      })
    ).getAllByRole("listitem");

    expect(within(otherListItems[0]).getByLabelText(/tunnel \[2\]/i)).toBeInTheDocument();
    expect(within(otherListItems[1]).getByLabelText(/underpass \[2\]/i)).toBeInTheDocument();
  });

  // test("adds type to other when super class endpoint errors", async () => {
  //   server.use(
  //     http.get(createParalogEndpoint("ontology/class"), (req) => {
  //       const url = new URL(req.request.url);
  //       const classUri = url.searchParams.get("classUri");
  //       if (
  //         classUri === "http://ies.example.com/ontology/ies#SmallWindFarm"
  //       ) {
  //         return  HttpResponse.json("Not found",{status: 404});
  //       }
  //     })
  //   );
  //   const { user } = renderAssessmentTypes();
  //   await waitForDataToLoad();
  //
  //   await user.click(screen.getByRole("button", { name: "Other" }));
  //   const otherListItems = within(
  //     screen.getByRole("treeitem", {
  //       name: /other/i,
  //       expanded: true,
  //     })
  //   ).getAllByRole("listitem");
  //
  //   expect(otherListItems).toHaveLength(3);
  //   expect(
  //     within(otherListItems[0]).getByLabelText(/small wind farm \[9\]/i)
  //   ).toBeInTheDocument();
  // });
  //
  // test("renders message when asset types are not found", async () => {
  //   server.use(http.get(createParalogEndpoint("assessments/asset-types"), mockEmptyResponse));
  //   renderAssessmentTypes();
  //   await waitForDataToLoad();
  //
  //   expect(await screen.findByText("Dataset types not found")).toBeInTheDocument();
  // });
  //
  // test("renders error message when /assessments/asset-types api call fails", async () => {
  //   server.use(http.get(createParalogEndpoint("assessments/asset-types"), mock400Error));
  //   renderAssessmentTypes();
  //   await waitForDataToLoad();
  //
  //   expect(
  //     screen.getByText(
  //       "An error occurred while retrieving data types for https://www.example.com/Instruments#wowAssessment"
  //     )
  //   ).toBeInTheDocument();
  // });
});
