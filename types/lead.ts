export type LeadStatus = "new" | "contacted" | "closed";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: LeadStatus;
  owner: string;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface LeadFilters {
  keyword?: string;
  status?: LeadStatus;
  page?: number;
  pageSize?: number;
}

export interface PaginatedLeads {
  items: Lead[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: {
    keyword?: string;
    status?: LeadStatus;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  detail: {
    code: string;
    message: string;
  };
}
