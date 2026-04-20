"use client";

import { Lead, LeadStatus } from "@/types/lead";
import StatusDropdown from "./StatusDropdown";
import { Calendar, Phone, User, FileText } from "lucide-react";

interface LeadCardProps {
  lead: Lead;
  onStatusChange: (id: string, status: LeadStatus) => void;
  isUpdating?: boolean;
}

export default function LeadCard({ lead, onStatusChange, isUpdating }: LeadCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{lead.name}</h3>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
            <Phone className="size-3.5" />
            {lead.phone}
          </div>
        </div>
        <StatusDropdown
          currentStatus={lead.status}
          onChange={(status) => onStatusChange(lead.id, status)}
          disabled={isUpdating}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-1.5 text-gray-600">
          <User className="size-3.5 text-gray-400" />
          <span className="text-gray-500">Owner:</span> {lead.owner}
        </div>
        <div className="flex items-center gap-1.5 text-gray-600">
          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600">{lead.source}</span>
        </div>
      </div>

      {lead.note && (
        <div className="flex items-start gap-1.5 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg">
          <FileText className="size-3.5 text-gray-400 mt-0.5 shrink-0" />
          <span className="line-clamp-2">{lead.note}</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1 border-t border-gray-100">
        <Calendar className="size-3" />
        {new Date(lead.created_at).toLocaleDateString()}
      </div>
    </div>
  );
}
