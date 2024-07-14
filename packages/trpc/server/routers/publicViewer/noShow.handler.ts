import type { TNoShowInputSchema } from "./noShow.schema";
import handleMarkNoShow from "@sln/features/handleMarkNoShow";

type NoShowOptions = {
  input: TNoShowInputSchema;
};

export const noShowHandler = async ({ input }: NoShowOptions) => {
  const { bookingUid, attendees } = input;

  return handleMarkNoShow({ bookingUid, attendees });
};

export default noShowHandler;
