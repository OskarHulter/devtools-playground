import { mergeOverlappingDateRanges } from "./date-range-utils/mergeOverlappingDateRanges";
import type { DateRange } from "@sln/lib/date-ranges";
import { intersect } from "@sln/lib/date-ranges";
import { SchedulingType } from "@sln/prisma/enums";

export const getAggregatedAvailability = (
  userAvailability: {
    dateRanges: DateRange[];
    oooExcludedDateRanges: DateRange[];
    user?: { isFixed?: boolean };
  }[],
  schedulingType: SchedulingType | null
): DateRange[] => {
  const isTeamEvent =
    schedulingType === SchedulingType.COLLECTIVE ||
    schedulingType === SchedulingType.ROUND_ROBIN ||
    userAvailability.length > 1;
  const fixedHosts = userAvailability.filter(
    ({ user }) =>
      !schedulingType ||
      schedulingType === SchedulingType.COLLECTIVE ||
      user?.isFixed
  );

  const dateRangesToIntersect = fixedHosts.map((s) =>
    !isTeamEvent ? s.dateRanges : s.oooExcludedDateRanges
  );

  const unfixedHosts = userAvailability.filter(
    ({ user }) => user?.isFixed !== true
  );
  if (unfixedHosts.length) {
    dateRangesToIntersect.push(
      unfixedHosts.flatMap((s) =>
        !isTeamEvent ? s.dateRanges : s.oooExcludedDateRanges
      )
    );
  }

  const availability = intersect(dateRangesToIntersect);

  return mergeOverlappingDateRanges(availability);
};
