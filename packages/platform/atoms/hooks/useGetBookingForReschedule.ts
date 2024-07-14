import { useQuery } from "@tanstack/react-query";

import { V2_ENDPOINTS, SUCCESS_STATUS } from "@sln/platform-constants";
import type { getBookingForReschedule } from "@sln/platform-libraries";
import type { ApiResponse, ApiSuccessResponse } from "@sln/platform-types";

import http from "../lib/http";
import { useAtomsContext } from "./useAtomsContext";

export const QUERY_KEY = "user-booking";

interface IUseGetBookingForReschedule {
  onSuccess?: (
    res: ApiSuccessResponse<
      Awaited<ReturnType<typeof getBookingForReschedule>>
    >["data"]
  ) => void;
  onError?: (err: Error) => void;
  uid?: string;
}
export const useGetBookingForReschedule = (
  props: IUseGetBookingForReschedule = {
    onSuccess: () => {
      return;
    },
    onError: () => {
      return;
    },
    uid: "",
  }
) => {
  const { isInit } = useAtomsContext();
  const pathname = `/${V2_ENDPOINTS.bookings}/${props.uid}/reschedule`;
  const bookingQuery = useQuery({
    queryKey: [QUERY_KEY, props.uid],
    queryFn: () => {
      return http
        .get<ApiResponse<Awaited<ReturnType<typeof getBookingForReschedule>>>>(
          pathname
        )
        .then((res) => {
          if (res.data.status === SUCCESS_STATUS) {
            props.onSuccess?.(
              (
                res.data as ApiSuccessResponse<
                  Awaited<ReturnType<typeof getBookingForReschedule>>
                >
              ).data
            );
            return (
              res.data as ApiSuccessResponse<
                Awaited<ReturnType<typeof getBookingForReschedule>>
              >
            ).data;
          }
          const error = new Error(res.data.error.message);
          props.onError?.(error);
          throw error;
        })
        .catch((err) => {
          props.onError?.(err);
        });
    },
    enabled: isInit && !!props?.uid,
  });

  return bookingQuery;
};
