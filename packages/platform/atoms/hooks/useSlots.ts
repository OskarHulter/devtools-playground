import { useEffect } from "react";
import { shallow } from "zustand/shallow";

import dayjs from "@sln/dayjs";
import { useBookerStore } from "@sln/features/bookings/Booker/store";
import { useSlotReservationId } from "@sln/features/bookings/Booker/useSlotReservationId";
import type { BookerEvent } from "@sln/features/bookings/types";
import { MINUTES_TO_BOOK } from "@sln/lib/constants";

import { useDeleteSelectedSlot } from "./useDeleteSelectedSlot";
import { useReserveSlot } from "./useReserveSlot";

export type UseSlotsReturnType = ReturnType<typeof useSlots>;

export const useSlots = (event: {
  data?: Pick<BookerEvent, "id" | "length"> | null;
}) => {
  const selectedDuration = useBookerStore((state) => state.selectedDuration);
  const [selectedTimeslot, setSelectedTimeslot] = useBookerStore(
    (state) => [state.selectedTimeslot, state.setSelectedTimeslot],
    shallow
  );
  const [slotReservationId, setSlotReservationId] = useSlotReservationId();
  const reserveSlotMutation = useReserveSlot({
    onSuccess: (res) => {
      setSlotReservationId(res.data);
    },
  });

  const removeSelectedSlot = useDeleteSelectedSlot();
  const handleRemoveSlot = () => {
    if (event?.data) {
      removeSelectedSlot.mutate({ uid: slotReservationId ?? undefined });
    }
  };
  const handleReserveSlot = () => {
    if (
      event?.data?.id &&
      selectedTimeslot &&
      (selectedDuration || event?.data?.length)
    ) {
      reserveSlotMutation.mutate({
        slotUtcStartDate: dayjs(selectedTimeslot).utc().format(),
        eventTypeId: event.data.id,
        slotUtcEndDate: dayjs(selectedTimeslot)
          .utc()
          .add(selectedDuration || event.data.length, "minutes")
          .format(),
      });
    }
  };

  const timeslot = useBookerStore((state) => state.selectedTimeslot);

  useEffect(() => {
    handleReserveSlot();

    const interval = setInterval(() => {
      handleReserveSlot();
    }, parseInt(MINUTES_TO_BOOK) * 60 * 1000 - 2000);

    return () => {
      handleRemoveSlot();
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.data?.id, timeslot]);

  return {
    selectedTimeslot,
    setSelectedTimeslot,
    setSlotReservationId,
    slotReservationId,
    handleReserveSlot,
    handleRemoveSlot,
  };
};
