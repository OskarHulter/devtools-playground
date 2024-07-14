import { useMutation } from "@tanstack/react-query";

import { SUCCESS_STATUS } from "@sln/platform-constants";
import type { BookingResponse } from "@sln/platform-libraries";
import type {
  ApiResponse,
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@sln/platform-types";
import type { BookingCreateBody } from "@sln/prisma/zod-utils";

import http from "../lib/http";

interface IUseCreateInstantBooking {
  onSuccess?: (res: ApiSuccessResponse<BookingResponse>) => void;
  onError?: (err: ApiErrorResponse | Error) => void;
}
export const useCreateInstantBooking = (
  { onSuccess, onError }: IUseCreateInstantBooking = {
    onSuccess: () => {
      return;
    },
    onError: () => {
      return;
    },
  }
) => {
  const createInstantBooking = useMutation<
    ApiResponse<BookingResponse>,
    Error,
    BookingCreateBody
  >({
    mutationFn: (data) => {
      return http
        .post<ApiResponse<BookingResponse>>("/bookings/instant", data)
        .then((res) => {
          if (res.data.status === SUCCESS_STATUS) {
            return res.data;
          }
          throw new Error(res.data.error.message);
        });
    },
    onSuccess: (data) => {
      if (data.status === SUCCESS_STATUS) {
        onSuccess?.(data);
      } else {
        onError?.(data);
      }
    },
    onError: (err) => {
      onError?.(err);
    },
  });
  return createInstantBooking;
};
