import type { EventBusyDate } from "@sln/types/Calendar";
import { create } from "zustand";

interface IOverlayCalendarStore {
  overlayBusyDates: EventBusyDate[] | undefined;
  setOverlayBusyDates: (busyDates: EventBusyDate[]) => void;
  continueWithProviderModal: boolean;
  setContinueWithProviderModal: (value: boolean) => void;
  calendarSettingsOverlayModal: boolean;
  setCalendarSettingsOverlayModal: (value: boolean) => void;
}

export const useOverlayCalendarStore = create<IOverlayCalendarStore>((set) => ({
  overlayBusyDates: undefined,
  setOverlayBusyDates: (busyDates: EventBusyDate[]) => {
    set({ overlayBusyDates: busyDates });
  },
  calendarSettingsOverlayModal: false,
  setCalendarSettingsOverlayModal: (value: boolean) => {
    set({ calendarSettingsOverlayModal: value });
  },
  continueWithProviderModal: false,
  setContinueWithProviderModal: (value: boolean) => {
    set({ continueWithProviderModal: value });
  },
}));
