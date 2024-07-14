import type * as payments from "@sln/features/ee/teams/lib/payments";
import { beforeEach, vi, expect } from "vitest";
import { mockReset, mockDeep } from "vitest-mock-extended";

vi.mock("@sln/features/ee/teams/lib/payments", () => paymentsMock);

beforeEach(() => {
  mockReset(paymentsMock);
});

const paymentsMock = mockDeep<typeof payments>();

export const paymentsScenarios = {};
export const paymentsExpects = {
  expectQuantitySubscriptionToBeUpdatedForTeam: (teamId: number) => {
    expect(
      paymentsMock.updateQuantitySubscriptionFromStripe
    ).toHaveBeenCalledWith(teamId);
  },
};

export default paymentsMock;
