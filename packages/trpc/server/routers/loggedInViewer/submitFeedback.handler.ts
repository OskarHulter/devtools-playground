import type { TSubmitFeedbackInputSchema } from "./submitFeedback.schema";
import dayjs from "@sln/dayjs";
import { sendFeedbackEmail } from "@sln/emails";
import { sendFeedbackFormbricks } from "@sln/lib/formbricks";
import { prisma } from "@sln/prisma";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";

type SubmitFeedbackOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TSubmitFeedbackInputSchema;
};

export const submitFeedbackHandler = async ({
  ctx,
  input,
}: SubmitFeedbackOptions) => {
  const { rating, comment } = input;

  const feedback = {
    username: ctx.user.username || "Nameless",
    email: ctx.user.email || "No email address",
    rating: rating,
    comment: comment,
  };

  await prisma.feedback.create({
    data: {
      date: dayjs().toISOString(),
      userId: ctx.user.id,
      rating: rating,
      comment: comment,
    },
  });
  if (
    process.env.NEXT_PUBLIC_FORMBRICKS_HOST_URL &&
    process.env.NEXT_PUBLIC_FORMBRICKS_ENVIRONMENT_ID
  )
    sendFeedbackFormbricks(ctx.user.id, feedback);

  if (process.env.SEND_FEEDBACK_EMAIL && comment) sendFeedbackEmail(feedback);
};
