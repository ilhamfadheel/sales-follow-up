"use client";

import { LeadStatus } from "@/types/lead";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Circle, PhoneCall, CheckCircle } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface StatusDropdownProps {
  currentStatus: LeadStatus;
  onChange: (status: LeadStatus) => void;
  disabled?: boolean;
}

const options: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

export default function StatusDropdown({ currentStatus, onChange, disabled }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-1 hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        <StatusBadge status={currentStatus} />
        <ChevronDown className={`size-3 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-in fade-in zoom-in-95 duration-100">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors
                ${currentStatus === option.value ? "bg-blue-50 text-blue-700" : "text-gray-700"}`}
            >
              {option.value === "new" && <Circle className="size-3 fill-blue-500 text-blue-500" />}
              {option.value === "contacted" && <PhoneCall className="size-3 text-amber-500" />}
              {option.value === "closed" && <CheckCircle className="size-3 text-emerald-500" />}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
