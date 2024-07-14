import { BookerSeo } from "./BookerSeo";
import { getOrgFullOrigin } from "@sln/ee/organizations/lib/orgDomains";
import { trpc } from "@sln/trpc/react";
import { HeadSeo } from "@sln/ui";
import { render } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi } from "vitest";

// Mocking necessary modules and hooks
vi.mock("@sln/trpc/react", () => ({
  trpc: {
    viewer: {
      public: {
        event: {
          useQuery: vi.fn(),
        },
      },
    },
  },
}));

vi.mock("@sln/lib/hooks/useLocale", () => ({
  useLocale: () => ({ t: (key: string) => key }),
}));

vi.mock("@sln/ee/organizations/lib/orgDomains", () => ({
  getOrgFullOrigin: vi.fn(),
}));

vi.mock("@sln/ui", () => ({
  HeadSeo: vi.fn(),
}));

describe("BookerSeo Component", () => {
  it("renders HeadSeo with correct props", () => {
    const mockData = {
      event: {
        slug: "event-slug",
        profile: { name: "John Doe", image: "image-url", username: "john" },
        title: "30min",
        hidden: false,
        users: [{ name: "Jane Doe", username: "jane" }],
      },
      entity: { fromRedirectOfNonOrgLink: false, orgSlug: "org1" },
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    trpc.viewer.public.event.useQuery.mockReturnValueOnce({
      data: mockData.event,
    });

    vi.mocked(getOrgFullOrigin).mockImplementation(
      (text: string | null) => `${text}.cal.local`
    );

    render(
      <BookerSeo
        username={mockData.event.profile.username}
        eventSlug={mockData.event.slug}
        rescheduleUid={undefined}
        entity={mockData.entity}
      />
    );

    expect(HeadSeo).toHaveBeenCalledWith(
      {
        origin: `${mockData.entity.orgSlug}.cal.local`,
        isBrandingHidden: undefined,
        // Don't know why we are adding space in the beginning
        title: ` ${mockData.event.title} | ${mockData.event.profile.name}`,
        description: ` ${mockData.event.title}`,
        meeting: {
          profile: {
            name: mockData.event.profile.name,
            image: mockData.event.profile.image,
          },
          title: mockData.event.title,
          users: [
            {
              name: mockData.event.users[0].name,
              username: mockData.event.users[0].username,
            },
          ],
        },
        nextSeoProps: {
          nofollow: true,
          noindex: true,
        },
      },
      {}
    );
  });
});
