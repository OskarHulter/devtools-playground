import { recurringEventType as recurringEventSchema } from "@sln/prisma/zod-utils";
import type { RecurringEvent } from "@sln/types/Calendar";

export function isRecurringEvent(obj: unknown): obj is RecurringEvent {
  const parsed = recurringEventSchema.safeParse(obj);

  return parsed.success;
}

export function parseRecurringEvent(obj: unknown): RecurringEvent | null {
  let recurringEvent: RecurringEvent | null = null;

  if (isRecurringEvent(obj)) recurringEvent = obj;

  return recurringEvent;
}
