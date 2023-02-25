export interface AppResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
  errorCode?: number;
  errorData?: unknown;
}

export interface AppResponseWithUser<T> {
  UserData: any;
  LeadData: T;
}
