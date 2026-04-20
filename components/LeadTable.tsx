"use client";

import { Lead, LeadStatus } from "@/types/lead";
import StatusDropdown from "./StatusDropdown";
import { Calendar, Phone, User } from "lucide-react";

interface LeadTableProps {
  leads: Lead[];
  onStatusChange: (id: string, status: LeadStatus) => void;
  updatingId?: string | null;
}

export default function LeadTable({ leads, onStatusChange, updatingId }: LeadTableProps) {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Owner
            </th>
            <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Note
            </th>
            <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Created
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="group hover:bg-blue-50/50 transition-colors duration-150"
            >
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="size-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-xs font-bold text-blue-700 mr-3">
                    {lead.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{lead.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Phone className="size-3.5 text-gray-400" />
                  {lead.phone}
                </div>
              </td>
              <td className="px-6 py-4">
                <StatusDropdown
                  currentStatus={lead.status}
                  onChange={(status) => onStatusChange(lead.id, status)}
                  disabled={updatingId === lead.id}
                />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <User className="size-3.5 text-gray-400" />
                  {lead.owner}
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-500 max-w-[200px] truncate" title={lead.note}>
                  {lead.note || "—"}
                </p>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Calendar className="size-3" />
                  {new Date(lead.created_at).toLocaleDateString()}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
