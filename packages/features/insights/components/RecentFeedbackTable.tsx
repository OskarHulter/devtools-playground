import { useFilterContext } from "../context/provider";
import { CardInsights } from "./Card";
import { FeedbackTable } from "./FeedbackTable";
import { LoadingInsight } from "./LoadingInsights";
import { useLocale } from "@sln/lib/hooks/useLocale";
import { trpc } from "@sln/trpc";
import { Title } from "@tremor/react";

export const RecentFeedbackTable = () => {
  const { t } = useLocale();
  const { filter } = useFilterContext();
  const {
    dateRange,
    selectedEventTypeId,
    selectedTeamId: teamId,
    isAll,
    initialConfig,
  } = filter;
  const [startDate, endDate] = dateRange;

  const { data, isSuccess, isPending } =
    trpc.viewer.insights.recentRatings.useQuery(
      {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        teamId,
        eventTypeId: selectedEventTypeId ?? undefined,
        isAll,
      },
      {
        staleTime: 30000,
        trpc: {
          context: { skipBatch: true },
        },
        enabled: !!(
          initialConfig?.teamId ||
          initialConfig?.userId ||
          initialConfig?.isAll
        ),
      }
    );

  if (isPending) return <LoadingInsight />;

  if (!isSuccess || !startDate || !endDate || !teamId) return null;

  return (
    <CardInsights>
      <Title className="text-emphasis">{t("recent_ratings")}</Title>
      <FeedbackTable data={data} />
    </CardInsights>
  );
};
