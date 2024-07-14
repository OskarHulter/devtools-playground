import prismaMock from "../../../../../../tests/libs/__mocks__/prismaMock";
import getUpgradeableHandler from "./getUpgradeable.handler";
import { MembershipRole } from "@sln/prisma/enums";
import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@sln/lib/constants", () => ({
  IS_TEAM_BILLING_ENABLED: true,
}));

describe("getUpgradeableHandler", () => {
  const ctx = {
    userId: 1137,
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  it("should return teams without subscriptionId in their metadata", async () => {
    // Mock the return value of prisma.membership.findMany
    prismaMock.membership.findMany.mockResolvedValue([
      {
        team: {
          metadata: {},
          isOrganization: false,
          children: [],
        },
        user: { id: 1137 },
        role: MembershipRole.OWNER,
      },
      {
        team: {
          metadata: { subscriptionId: "123" },
          isOrganization: false,
          children: [],
        },
        user: { id: 1137 },
        role: MembershipRole.OWNER,
      },
    ]);

    const result = await getUpgradeableHandler(ctx);

    expect(result).toEqual([
      {
        team: {
          metadata: {},
          isOrganization: false,
          children: [],
        },
        user: { id: 1137 },
        role: MembershipRole.OWNER,
      },
    ]);
  });

  it("should return teams that are not organizations", async () => {
    // Mock the return value of prisma.membership.findMany
    prismaMock.membership.findMany.mockResolvedValue([
      {
        team: {
          metadata: {},
          isOrganization: true,
          children: [],
        },
        user: { id: 1137 },
        role: MembershipRole.OWNER,
      },
      {
        team: {
          metadata: {},
          isOrganization: false,
          children: [],
        },
        user: { id: 1137 },
        role: MembershipRole.OWNER,
      },
    ]);

    const result = await getUpgradeableHandler(ctx);

    expect(result).toEqual([
      {
        team: {
          metadata: {},
          isOrganization: false,
          children: [],
        },
        user: { id: 1137 },
        role: MembershipRole.OWNER,
      },
    ]);
  });

  it("should return teams without children", async () => {
    // Mock the return value of prisma.membership.findMany
    prismaMock.membership.findMany.mockResolvedValue([
      {
        team: {
          metadata: {},
          isOrganization: false,
          children: [{ id: "child-id-1" }],
        },
        user: { id: 1137 },
        role: MembershipRole.OWNER,
      },
      {
        team: {
          metadata: {},
          isOrganization: false,
          children: [],
        },
        user: { id: 1137 },
        role: MembershipRole.OWNER,
      },
    ]);

    const result = await getUpgradeableHandler(ctx);

    expect(result).toEqual([
      {
        team: {
          metadata: {},
          isOrganization: false,
          children: [],
        },
        user: { id: 1137 },
        role: MembershipRole.OWNER,
      },
    ]);
  });
});
