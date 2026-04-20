"use client";

import { LeadStatus } from "@/types/lead";
import { Circle, PhoneCall, CheckCircle } from "lucide-react";

interface StatusBadgeProps {
  status: LeadStatus;
}

const config: Record<LeadStatus, { label: string; className: string; icon: React.ReactNode }> = {
  new: {
    label: "New",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <Circle className="size-3 fill-blue-500 text-blue-500" />,
  },
  contacted: {
    label: "Contacted",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <PhoneCall className="size-3" />,
  },
  closed: {
    label: "Closed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CheckCircle className="size-3" />,
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className, icon } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}
    >
      {icon}
      {label}
    </span>
  );
}
