import CreateTeamDialog from "./CreateTeamDialog";
import GroupNameCell from "./GroupNameCell";
import { useLocale } from "@sln/lib/hooks/useLocale";
import { trpc } from "@sln/trpc/react";
import { DataTable, Button } from "@sln/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { useRef, useState } from "react";

interface TeamGroupMapping {
  name: string;
  id: number;
  groupNames: string[];
  directoryId: string;
}

const GroupTeamMappingTable = () => {
  const { t } = useLocale();
  const [createTeamDialogOpen, setCreateTeamDialogOpen] = useState(false);

  const { data } = trpc.viewer.dsync.teamGroupMapping.get.useQuery();

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const columns: ColumnDef<TeamGroupMapping>[] = [
    {
      id: "name",
      header: t("team"),
      cell: ({ row }) => {
        const { name } = row.original;

        return <p>{name}</p>;
      },
    },
    {
      id: "group",
      header: t("group_name"),
      cell: ({ row }) => {
        const { id, groupNames, directoryId } = row.original;

        return (
          <GroupNameCell
            groupNames={groupNames}
            teamId={id}
            directoryId={directoryId}
          />
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        data={data ? data.teamGroupMapping : []}
        tableContainerRef={tableContainerRef}
        columns={columns}
        tableCTA={
          <Button onClick={() => setCreateTeamDialogOpen(true)}>
            Create team
          </Button>
        }
      />
      <CreateTeamDialog
        open={createTeamDialogOpen}
        onOpenChange={setCreateTeamDialogOpen}
      />
    </>
  );
};

export default GroupTeamMappingTable;
