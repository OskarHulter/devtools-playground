import prismock from "../../../../../tests/libs/__mocks__/prisma";
import { handleWebhookScheduledTriggers } from "../handleWebhookScheduledTriggers";
import dayjs from "@sln/dayjs";
import { test } from "@sln/web/test/fixtures/fixtures";
import { expectWebhookToHaveBeenCalledWith } from "@sln/web/test/utils/bookingScenario/expects";
import { describe, expect, beforeEach } from "vitest";

describe("Cron job handler", () => {
  beforeEach(async () => {
    await prismock.webhookScheduledTriggers.deleteMany();
  });
  test(`should delete old webhook scheduled triggers`, async () => {
    const now = dayjs();
    await prismock.webhookScheduledTriggers.createMany({
      data: [
        {
          id: 1,
          subscriberUrl: "https://example.com",
          startAfter: now.subtract(2, "day").toDate(),
          payload: "",
        },
        {
          id: 1,
          subscriberUrl: "https://example.com",
          startAfter: now.subtract(1, "day").subtract(1, "hour").toDate(),
          payload: "",
        },
        {
          id: 2,
          subscriberUrl: "https://example.com",
          startAfter: now.add(1, "day").toDate(),
          payload: "",
        },
      ],
    });

    await handleWebhookScheduledTriggers(prismock);

    const scheduledTriggers =
      await prismock.webhookScheduledTriggers.findMany();
    expect(scheduledTriggers.length).toBe(1);
    expect(scheduledTriggers[0].startAfter).toStrictEqual(
      now.add(1, "day").toDate()
    );
  });
  test(`should trigger if current date is after startAfter`, async () => {
    const now = dayjs();
    const payload = `{"triggerEvent":"MEETING_ENDED"}`;
    await prismock.webhookScheduledTriggers.createMany({
      data: [
        {
          id: 1,
          subscriberUrl: "https://example.com",
          startAfter: now.add(5, "minute").toDate(),
          payload,
        },
        {
          id: 2,
          subscriberUrl: "https://example.com/test",
          startAfter: now.subtract(5, "minute").toDate(),
          payload,
        },
      ],
    });
    await handleWebhookScheduledTriggers(prismock);

    expectWebhookToHaveBeenCalledWith("https://example.com/test", {
      triggerEvent: "MEETING_ENDED",
      payload,
    });
    expect(() =>
      expectWebhookToHaveBeenCalledWith("https://example.com", {
        triggerEvent: "MEETING_ENDED",
        payload,
      })
    ).toThrow(
      "Webhook not sent to https://example.com for MEETING_ENDED. All webhooks: []"
    );
  });
});
