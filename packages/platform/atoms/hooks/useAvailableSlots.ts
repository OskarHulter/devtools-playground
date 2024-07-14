import { useQuery } from "@tanstack/react-query";

import { SUCCESS_STATUS } from "@sln/platform-constants";
import type { AvailableSlotsType } from "@sln/platform-libraries";
import type {
  GetAvailableSlotsInput,
  ApiResponse,
  ApiSuccessResponse,
} from "@sln/platform-types";

import http from "../lib/http";

export const QUERY_KEY = "get-available-slots";

export const useAvailableSlots = ({
  enabled,
  ...rest
}: GetAvailableSlotsInput & { enabled: boolean }) => {
  const availableSlots = useQuery({
    queryKey: [
      QUERY_KEY,
      rest.startTime,
      rest.endTime,
      rest.eventTypeId,
      rest.eventTypeSlug,
    ],
    queryFn: () => {
      return http
        .get<ApiResponse<AvailableSlotsType>>("/slots/available", {
          params: rest,
        })
        .then((res) => {
          if (res.data.status === SUCCESS_STATUS) {
            return (res.data as ApiSuccessResponse<AvailableSlotsType>).data;
          }
          throw new Error(res.data.error.message);
        });
    },
    enabled: enabled,
  });
  return availableSlots;
};
