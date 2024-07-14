import { sendOrganizerPaymentRefundFailedEmail } from "@sln/emails";
import type { CalendarEvent } from "@sln/types/Calendar";

const handleRefundError = async (opts: {
  event: CalendarEvent;
  reason: string;
  paymentId: string;
}) => {
  console.error(
    `refund failed: ${opts.reason} for booking '${opts.event.uid}'`
  );
  try {
    await sendOrganizerPaymentRefundFailedEmail({
      ...opts.event,
      paymentInfo: { reason: opts.reason, id: opts.paymentId },
    });
  } catch (e) {
    console.error(e);
  }
};

export { handleRefundError };
