export interface ApiResponse<T> {
  message: string;
  data: T;
  success: boolean;
}

export function successResponse<T>(message: string, data: T): ApiResponse<T> {
  return {
    message,
    data,
    success: true,
  };
}
