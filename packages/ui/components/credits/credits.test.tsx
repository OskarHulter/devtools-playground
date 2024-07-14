/* eslint-disable playwright/missing-playwright-await */
import Credits from "./Credits";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";


vi.mock("@sln/lib/constants", async () => {
  const actual = (await vi.importActual(
    "@sln/lib/constants"
  )) as typeof import("@sln/lib/constants");
  return {
    ...actual,
    CALCOM_VERSION: "mockedVersion",
  };
});

describe("Tests for Credits component", () => {
  test("Should render credits section with links", () => {
    render(<Credits />);

    const creditsLinkElement = screen.getByRole("link", {
      name: /Cal\.com, Inc\./i,
    });
    expect(creditsLinkElement).toBeInTheDocument();
    expect(creditsLinkElement).toHaveAttribute(
      "href",
      "https://go.oskarhulter.com/credits"
    );

    const versionLinkElement = screen.getByRole("link", {
      name: /mockedVersion/i,
    });
    expect(versionLinkElement).toBeInTheDocument();
    expect(versionLinkElement).toHaveAttribute(
      "href",
      "https://go.oskarhulter.com/releases"
    );
  });

  test("Should render credits section with correct text", () => {
    render(<Credits />);

    const currentYear = new Date().getFullYear();
    const copyrightElement = screen.getByText(`© ${currentYear}`);
    expect(copyrightElement).toHaveTextContent(`${currentYear}`);
  });
});
