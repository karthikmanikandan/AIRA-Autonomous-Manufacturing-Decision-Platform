"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, AlertTriangle, Info, Terminal } from "lucide-react";
import { RiskEvent } from "@/lib/types";

interface RiskStreamProps {
  events: RiskEvent[];
  maxVisible?: number;
}

export default function RiskStream({
  events,
  maxVisible = 8
}: RiskStreamProps) {
  const [hovered, setHovered] = useState(false);

  const getSourceBadgeColor = (source: string) => {
    return {
      ERP: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      MES: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      WMS: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      DMS: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      IoT: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      Telematics: "bg-red-500/10 text-red-400 border-red-500/20",
      System: "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }[source] || "bg-slate-500/10 text-slate-400 border-slate-500/20";
  };

  const getSeverityIcon = (severity: string) => {
    return {
      critical: <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />,
      warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
      info: <Info className="w-4 h-4 text-emerald-500" />
    }[severity] || <Info className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div 
      className="glass-card border p-4 h-[280px] flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h3 className="text-xs font-bold uppercase tracking-wider text-aira-text-secondary mb-4 flex items-center gap-2">
        <Terminal className="w-4 h-4 text-aira-cyan" />
        Predictive Risk Stream
      </h3>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 select-none">
        <AnimatePresence initial={false}>
          {events.slice(0, maxVisible).map((event) => (
            <motion.div
              key={event.event_id}
              initial={{ opacity: 0, x: -10, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 10, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-lg border flex items-start gap-3 transition-all duration-300 ${
                event.severity === "critical" 
                  ? "bg-red-500/5 border-red-500/20 hover:border-red-500/35 glow-red" 
                  : "bg-white/5 border-white/5 hover:border-white/10"
              }`}
            >
              {/* Severity Icon */}
              <div className="mt-0.5 shrink-0">{getSeverityIcon(event.severity)}</div>

              {/* Event Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  {/* Source Badge */}
                  <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded border ${getSourceBadgeColor(event.source)}`}>
                    {event.source}
                  </span>
                  <span className="text-[10px] font-mono text-aira-text-muted">{event.timestamp}</span>
                </div>
                <p className="text-xs font-mono tracking-tight text-aira-text break-words">
                  {event.description}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
