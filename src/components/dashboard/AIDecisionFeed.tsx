"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, History, User } from "lucide-react";

interface DecisionItem {
  id: string;
  time: string;
  summary: string;
  status: "pending" | "approved" | "executed";
  agents: string[];
  details: string;
}

export default function AIDecisionFeed() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const decisions: DecisionItem[] = [
    {
      id: "DEC-2847",
      time: "14:02 IST",
      summary: "Consolidated Dispatch Recommendation: Replace battery TRK-2847",
      status: "executed",
      agents: ["Telematics", "Inventory", "Production", "Finance", "Logistics", "Quality", "Dealer"],
      details: "Supervisor integrated all specialist agent inputs. Rerouted battery pack shipment via NH-44, extended Line 3 break, and dispatched field technician. Unplanned shutdown avoided."
    },
    {
      id: "DEC-8124",
      time: "10:15 IST",
      summary: "Preventative Coupling Repair: Line 2 main spindle motor",
      status: "approved",
      agents: ["IoT Sensors", "Maintenance", "Finance"],
      details: "Anomalous vibration detected. Greasing coupling scheduled for next line transition period. Estimated OEE impact 0.5% vs 8% failure risk."
    },
    {
      id: "DEC-7102",
      time: "Yesterday",
      summary: "Supply Rerouting: Expedite Alternator cargo due to customs delay",
      status: "approved",
      agents: ["Inventory", "Logistics", "Finance"],
      details: "Alternative logistics carrier contracted. Extra expense approved by Finance to prevent inventory stockout at Warehouse A."
    }
  ];

  const getStatusColor = (status: string) => {
    return {
      pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      executed: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
    }[status] || "bg-slate-500/10 text-slate-400 border-slate-500/20";
  };

  return (
    <div className="glass-card border p-4 flex-1 min-h-[220px] h-0 flex flex-col">
      <h3 className="text-xs font-bold uppercase tracking-wider text-aira-text-secondary mb-4 flex items-center gap-2">
        <History className="w-4 h-4 text-aira-purple" />
        AI Decision Feed
      </h3>

      <div className="flex-1 overflow-y-auto pr-1">
        <div className="relative border-l border-white/5 pl-4 ml-2 space-y-4 pb-2">
        {decisions.map((dec) => {
          const isExpanded = expandedId === dec.id;
          
          return (
            <div key={dec.id} className="relative">
              {/* Timeline dot */}
              <div className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border border-[#0a0a0f] ${
                dec.status === "executed" ? "bg-cyan-500" : "bg-emerald-500"
              }`} />

              <div 
                className="p-3 bg-white/5 border border-white/5 hover:border-white/10 rounded-lg cursor-pointer transition-all duration-300"
                onClick={() => setExpandedId(isExpanded ? null : dec.id)}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono text-aira-text-muted">{dec.time}</span>
                    <h5 className="text-xs font-bold tracking-tight text-white mt-1 leading-snug break-words">
                      {dec.summary}
                    </h5>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase border shrink-0 ${getStatusColor(dec.status)}`}>
                    {dec.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mt-2.5">
                  {dec.agents.map((ag) => (
                    <span key={ag} className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-mono bg-white/5 text-aira-text-secondary border border-white/5">
                      <User className="w-2.5 h-2.5" />
                      {ag}
                    </span>
                  ))}
                  <span className="ml-auto">
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 opacity-60" /> : <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
                  </span>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 pt-3 border-t border-white/5 text-xs text-aira-text-secondary font-mono leading-relaxed"
                    >
                      {dec.details}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
