import type { TraceId } from "./trace";

export type ApiErrorCode = string;

export type ApiSuccess<T> = {
  data: T;
  traceId: TraceId;
};

export type ApiErrorDetails =
  | Record<string, unknown>
  | Array<Record<string, unknown>>;

export type ApiError = {
  code: ApiErrorCode;
  message: string;
  details?: ApiErrorDetails;
};

export type ApiErrorResponse = {
  error: ApiError;
  traceId: TraceId;
};

export type ApiEnvelope<T> = ApiSuccess<T> | ApiErrorResponse;

export function ok<T>(data: T, traceId: TraceId): ApiSuccess<T> {
  return { data, traceId };
}

export function fail(
  error: ApiError,
  traceId: TraceId,
): ApiErrorResponse {
  return { error, traceId };
}

