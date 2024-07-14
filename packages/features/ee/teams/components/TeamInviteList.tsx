import TeamInviteListItem from "./TeamInviteListItem";
import { trackFormbricksAction } from "@sln/lib/formbricks-client";
import type { MembershipRole } from "@sln/prisma/enums";
import { trpc } from "@sln/trpc/react";
import { showToast } from "@sln/ui";
import { useState } from "react";

interface Props {
  teams: {
    id?: number;
    name?: string | null;
    slug?: string | null;
    bio?: string | null;
    hideBranding?: boolean | undefined;
    role: MembershipRole;
    logoUrl?: string | null;
    accepted: boolean;
  }[];
}

export default function TeamInviteList(props: Props) {
  const utils = trpc.useUtils();

  const [hideDropdown, setHideDropdown] = useState(false);

  function selectAction(action: string, teamId: number) {
    switch (action) {
      case "disband":
        deleteTeam(teamId);
        break;
    }
  }

  const deleteTeamMutation = trpc.viewer.teams.delete.useMutation({
    async onSuccess() {
      await utils.viewer.teams.list.invalidate();
      await utils.viewer.teams.get.invalidate();
      await utils.viewer.organizations.listMembers.invalidate();
      trackFormbricksAction("team_disbanded");
    },
    async onError(err) {
      showToast(err.message, "error");
    },
  });

  function deleteTeam(teamId: number) {
    deleteTeamMutation.mutate({ teamId });
  }

  return (
    <div>
      <ul className="bg-default divide-subtle mb-8 divide-y rounded">
        {props.teams.map((team) => (
          <TeamInviteListItem
            key={team?.id as number}
            team={team}
            onActionSelect={(action: string) =>
              selectAction(action, team?.id as number)
            }
            isPending={deleteTeamMutation.isPending}
            hideDropdown={hideDropdown}
            setHideDropdown={setHideDropdown}
          />
        ))}
      </ul>
    </div>
  );
}
