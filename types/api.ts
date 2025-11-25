// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 时间范围类型
export type TimeRange =
  | "1d"
  | "5d"
  | "1m"
  | "3m"
  | "6m"
  | "1y"
  | "3y"
  | "5y"
  | "all";

// K线周期类型
export type KlinePeriod =
  | "1m"
  | "5m"
  | "15m"
  | "30m"
  | "60m"
  | "day"
  | "week"
  | "month";

// 排序类型
export type SortOrder = "asc" | "desc";

// 排序字段
export interface SortParams {
  field: string;
  order: SortOrder;
}
