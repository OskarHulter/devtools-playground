import { useQuery } from "@tanstack/react-query";

import { SUCCESS_STATUS } from "@sln/platform-constants";
import type { ConnectedDestinationCalendars } from "@sln/platform-libraries";
import type { ApiResponse, ApiSuccessResponse } from "@sln/platform-types";

import http from "../lib/http";

export const QUERY_KEY = "get-connected-calendars";
export const useConnectedCalendars = (props: { enabled?: boolean }) => {
  const calendars = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => {
      return http
        .get<ApiResponse<ConnectedDestinationCalendars>>("/calendars")
        .then((res) => {
          if (res.data.status === SUCCESS_STATUS) {
            return (
              res.data as ApiSuccessResponse<ConnectedDestinationCalendars>
            )?.data;
          }
          throw new Error(res.data.error.message);
        });
    },
    enabled: props?.enabled ?? true,
  });

  return calendars;
};
