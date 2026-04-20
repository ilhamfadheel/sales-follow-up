"use client";

import { LeadStatus } from "@/types/lead";
import { Filter } from "lucide-react";

interface StatusFilterProps {
  value: LeadStatus | "";
  onChange: (value: LeadStatus | "") => void;
}

const statusOptions: { value: LeadStatus | ""; label: string; color: string }[] = [
  { value: "", label: "All Statuses", color: "bg-gray-100 text-gray-700" },
  { value: "new", label: "New", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "contacted", label: "Contacted", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "closed", label: "Closed", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
];

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Filter className="size-4 text-gray-400" />
      <div className="flex gap-1.5">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200
              ${
                value === option.value
                  ? option.color + " ring-2 ring-offset-1 ring-gray-200"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
