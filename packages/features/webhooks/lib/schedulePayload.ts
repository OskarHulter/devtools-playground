import type sendPayload from "./sendPayload";
import tasker from "@sln/features/tasker";

type SchedulePayload = typeof sendPayload;

const schedulePayload: SchedulePayload = async (
  secretKey,
  triggerEvent,
  createdAt,
  webhook,
  data
) => {
  await tasker.create(
    "sendWebhook",
    JSON.stringify({ secretKey, triggerEvent, createdAt, webhook, data })
  );
  return {
    ok: true,
    status: 200,
    message: "Webhook scheduled successfully",
  };
};

export default schedulePayload;
