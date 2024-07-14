import { useBookerStore } from "../store";
import type { useScheduleForEventReturnType } from "../utils/event";
import type { Dayjs } from "@sln/dayjs";
import dayjs from "@sln/dayjs";
import { default as DatePickerComponent } from "@sln/features/calendars/DatePicker";
import { useNonEmptyScheduleDays } from "@sln/features/schedules";
import { weekdayToWeekIndex } from "@sln/lib/date-fns";
import { useLocale } from "@sln/lib/hooks/useLocale";
import type { User } from "@sln/prisma/client";
import { shallow } from "zustand/shallow";

export const DatePicker = ({
  event,
  schedule,
  classNames,
  scrollToTimeSlots,
}: {
  event: {
    data?: { users: Pick<User, "weekStart">[] } | null;
  };
  schedule: useScheduleForEventReturnType;
  classNames?: {
    datePickerContainer?: string;
    datePickerTitle?: string;
    datePickerDays?: string;
    datePickerDate?: string;
    datePickerDatesActive?: string;
    datePickerToggle?: string;
  };
  scrollToTimeSlots?: () => void;
}) => {
  const { i18n } = useLocale();
  const [month, selectedDate] = useBookerStore(
    (state) => [state.month, state.selectedDate],
    shallow
  );
  const [setSelectedDate, setMonth, setDayCount] = useBookerStore(
    (state) => [state.setSelectedDate, state.setMonth, state.setDayCount],
    shallow
  );
  const nonEmptyScheduleDays = useNonEmptyScheduleDays(schedule?.data?.slots);

  return (
    <DatePickerComponent
      customClassNames={{
        datePickerTitle: classNames?.datePickerTitle,
        datePickerDays: classNames?.datePickerDays,
        datePickersDates: classNames?.datePickerDate,
        datePickerDatesActive: classNames?.datePickerDatesActive,
        datePickerToggle: classNames?.datePickerToggle,
      }}
      className={classNames?.datePickerContainer}
      isPending={schedule.isPending}
      onChange={(date: Dayjs | null) => {
        setSelectedDate(date === null ? date : date.format("YYYY-MM-DD"));
      }}
      onMonthChange={(date: Dayjs) => {
        setMonth(date.format("YYYY-MM"));
        setSelectedDate(date.format("YYYY-MM-DD"));
        setDayCount(null); // Whenever the month is changed, we nullify getting X days
      }}
      includedDates={nonEmptyScheduleDays}
      locale={i18n.language}
      browsingDate={month ? dayjs(month) : undefined}
      selected={dayjs(selectedDate)}
      weekStart={weekdayToWeekIndex(event?.data?.users?.[0]?.weekStart)}
      slots={schedule?.data?.slots}
      scrollToTimeSlots={scrollToTimeSlots}
    />
  );
};
