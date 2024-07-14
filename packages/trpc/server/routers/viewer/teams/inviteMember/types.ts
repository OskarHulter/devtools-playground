import type { TInviteMemberInputSchema } from "./inviteMember.schema";
import type { Team } from "@sln/prisma/client";
import type { TrpcSessionUser } from "@sln/trpc/server/trpc";

export type InviteMemberOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TInviteMemberInputSchema;
};

export type TeamWithParent = Team & {
  parent: Team | null;
};
