import { EventTypeFilter } from "./EventTypeFilter";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { PeopleFilter } from "@sln/features/bookings/components/PeopleFilter";
import { useFilterQuery } from "@sln/features/bookings/lib/useFilterQuery";
import { TeamsFilter } from "@sln/features/filters/components/TeamsFilter";
import { useLocale } from "@sln/lib/hooks/useLocale";
import { Tooltip, Button } from "@sln/ui";

export interface FiltersContainerProps {
  isFiltersVisible: boolean;
}

export function FiltersContainer({ isFiltersVisible }: FiltersContainerProps) {
  const [animationParentRef] = useAutoAnimate<HTMLDivElement>();
  const { removeAllQueryParams } = useFilterQuery();
  const { t } = useLocale();

  return (
    <div ref={animationParentRef}>
      {isFiltersVisible ? (
        <div className="no-scrollbar flex w-full space-x-2 overflow-x-scroll rtl:space-x-reverse">
          <PeopleFilter />
          <EventTypeFilter />
          <TeamsFilter />
          <Tooltip content={t("remove_filters")}>
            <Button
              color="secondary"
              type="button"
              onClick={() => {
                removeAllQueryParams();
              }}
            >
              {t("remove_filters")}
            </Button>
          </Tooltip>
        </div>
      ) : null}
    </div>
  );
}
