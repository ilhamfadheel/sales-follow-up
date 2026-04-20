"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Users } from "lucide-react";
import { Lead, LeadStatus, PaginatedLeads } from "@/types/lead";
import { getLeads, createLead, updateLeadStatus } from "@/lib/api";
import SearchBar from "@/components/SearchBar";
import StatusFilter from "@/components/StatusFilter";
import LeadTable from "@/components/LeadTable";
import LeadCard from "@/components/LeadCard";
import AddLeadModal from "@/components/AddLeadModal";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import Pagination from "@/components/Pagination";

export default function Home() {
  const [data, setData] = useState<PaginatedLeads | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getLeads({ keyword, status: status || undefined, page, pageSize: 10 });
      setData(response.data);
    } catch (err: any) {
      setError(err?.detail?.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [keyword, status, page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    const lead = data?.items.find((l) => l.id === id);
    if (!lead || lead.status === newStatus) return;

    setUpdatingId(id);
    try {
      await updateLeadStatus(id, newStatus);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.id === id ? { ...item, status: newStatus, updated_at: new Date().toISOString() } : item
          ),
        };
      });
      setToast({ message: "Status updated successfully", type: "success" });
    } catch (err: any) {
      setToast({ message: err?.detail?.message || "Failed to update status", type: "error" });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateLead = async (leadData: Omit<Lead, "id" | "created_at" | "updated_at">) => {
    try {
      await createLead(leadData);
      setToast({ message: "Lead created successfully", type: "success" });
      await fetchLeads();
    } catch (err: any) {
      setToast({ message: err?.detail?.message || "Failed to create lead", type: "error" });
      throw err;
    }
  };

  const clearFilters = () => {
    setKeyword("");
    setStatus("");
    setPage(1);
  };

  const hasFilters = !!keyword || !!status;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="size-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="size-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">Sales Follow-Up</h1>
                <p className="text-xs text-gray-500">Lead Management</p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium 
                         hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
            >
              <Plus className="size-4" />
              Add Lead
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg border text-sm font-medium
              ${
                toast.type === "success"
                  ? "bg-white border-emerald-200 text-emerald-700"
                  : "bg-white border-red-200 text-red-700"
              }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <SearchBar value={keyword} onChange={(v) => { setKeyword(v); setPage(1); }} />
          <StatusFilter value={status} onChange={(v) => { setStatus(v); setPage(1); }} />
        </div>

        {/* Content */}
        {loading && !data ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="bg-white rounded-xl border border-gray-200">
            <ErrorState message={error} onRetry={fetchLeads} />
          </div>
        ) : data && data.items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200">
            <EmptyState hasFilters={hasFilters} onClearFilters={clearFilters} />
          </div>
        ) : data ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <LeadTable
                leads={data.items}
                onStatusChange={handleStatusChange}
                updatingId={updatingId}
              />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {data.items.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onStatusChange={handleStatusChange}
                  isUpdating={updatingId === lead.id}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              page={data.pagination.page}
              pageSize={data.pagination.pageSize}
              total={data.pagination.total}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        ) : null}
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateLead}
      />
    </main>
  );
}
