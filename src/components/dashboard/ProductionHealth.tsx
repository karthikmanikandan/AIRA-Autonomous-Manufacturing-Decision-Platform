"use client";

import React from "react";
import { Cpu } from "lucide-react";
import { productionLines } from "@/lib/mockData";

export default function ProductionHealth() {
  const getStatusColor = (status: string) => {
    return {
      running: "bg-emerald-500",
      maintenance: "bg-amber-500",
      idle: "bg-slate-500"
    }[status] || "bg-slate-500";
  };

  return (
    <div className="glass-card border p-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-aira-text-secondary mb-4 flex items-center gap-2">
        <Cpu className="w-4 h-4 text-aira-emerald" />
        Production Lines
      </h3>

      <div className="space-y-3.5">
        {productionLines.map((line, i) => (
          <div key={i} className="text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold">{line.name}</span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-aira-text-muted">({line.current_product})</span>
                <span className={`w-2 h-2 rounded-full ${getStatusColor(line.status)}`} />
                <span className="capitalize font-medium text-[10px]">{line.status}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/5 rounded-full h-1.5 relative overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-aira-emerald to-aira-cyan" 
                  style={{ width: `${line.utilization}%` }}
                />
              </div>
              <span className="font-mono text-xs w-8 text-right shrink-0">{line.utilization}%</span>
            </div>
            
            <div className="flex justify-between text-[10px] text-aira-text-muted mt-1 font-mono">
              <span>Next PM scheduled:</span>
              <span>{line.next_maintenance}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
