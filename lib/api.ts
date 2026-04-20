import axios from "axios";
import { Lead, LeadFilters, PaginatedLeads, ApiResponse, LeadStatus } from "@/types/lead";

const api = axios.create({
  baseURL: typeof window !== "undefined" ? "/api/demo" : "http://localhost:3000/api/demo",
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptors for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({
      detail: {
        code: "NETWORK_ERROR",
        message: "Network error occurred",
      },
    });
  }
);

export async function getMeta(): Promise<ApiResponse<{ statuses: LeadStatus[] }>> {
  const res = await api.get("/meta");
  return res.data;
}

export async function getLeads(filters: LeadFilters = {}): Promise<ApiResponse<PaginatedLeads>> {
  const params = new URLSearchParams();
  if (filters.keyword) params.set("keyword", filters.keyword);
  if (filters.status) params.set("status", filters.status);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));

  const res = await api.get(`/leads?${params.toString()}`);
  return res.data;
}

export async function getLead(id: string): Promise<ApiResponse<Lead>> {
  const res = await api.get(`/leads/${id}`);
  return res.data;
}

export async function createLead(lead: Omit<Lead, "id" | "created_at" | "updated_at">): Promise<ApiResponse<Lead>> {
  const res = await api.post("/leads", lead);
  return res.data;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<ApiResponse<Lead>> {
  const res = await api.patch(`/leads/${id}/status`, { status });
  return res.data;
}

export default api;
