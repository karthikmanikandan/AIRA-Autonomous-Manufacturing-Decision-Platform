"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, CheckCircle2, ShieldAlert } from "lucide-react";
import { digitalTwinScenarios } from "@/lib/mockData";

export default function DigitalTwinPanel() {
  const { scenarios, recommendation, comparison_summary } = digitalTwinScenarios;

  return (
    <div className="glass-card border p-5 flex flex-col h-full">
      {/* Title */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-aira-text-secondary flex items-center gap-2">
          <Cpu className="w-4 h-4 text-aira-cyan" />
          Digital Twin Simulation Engine
        </h3>
        <p className="text-[10px] font-mono text-aira-text-muted mt-0.5">
          Real-time predictive correlation & what-if analysis
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 mt-5 space-y-4">
        {/* Scenarios Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((sc, idx) => {
          const isA = idx === 0;
          return (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border relative flex flex-col justify-between ${
                isA 
                  ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/35 glow-emerald" 
                  : "bg-red-500/5 border-red-500/20 hover:border-red-500/35"
              }`}
            >
              {/* Scenario Label */}
              <div className="flex justify-between items-start gap-2">
                <h4 className="text-xs font-bold tracking-tight text-white font-mono uppercase">
                  {sc.name}
                </h4>
                {isA ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[8px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold font-mono">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    RECOMMENDED
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[8px] bg-red-500/20 text-red-400 border border-red-500/30 font-bold font-mono">
                    <ShieldAlert className="w-2.5 h-2.5 animate-pulse" />
                    RISK ZONE
                  </span>
                )}
              </div>
              <p className="text-[10px] font-mono text-aira-text-secondary mt-1 min-h-[30px] leading-relaxed">
                {sc.description}
              </p>

              {/* Metrics progress bars */}
              <div className="space-y-2.5 mt-4 pt-4 border-t border-white/5">
                {/* Downtime metric */}
                <div className="text-[10px]">
                  <div className="flex justify-between text-aira-text-secondary mb-1">
                    <span>Expected Downtime</span>
                    <span className="font-mono font-bold">{sc.metrics.downtime_hours} hours</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1 relative overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(sc.metrics.downtime_hours / 15) * 100}%` }}
                      className={`h-full rounded-full ${isA ? "bg-emerald-500" : "bg-red-500"}`}
                    />
                  </div>
                </div>

                {/* Production Loss */}
                <div className="text-[10px]">
                  <div className="flex justify-between text-aira-text-secondary mb-1">
                    <span>Production Loss Ratio</span>
                    <span className="font-mono font-bold">{sc.metrics.production_loss_pct}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1 relative overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${sc.metrics.production_loss_pct}%` }}
                      className={`h-full rounded-full ${isA ? "bg-emerald-500" : "bg-red-500"}`}
                    />
                  </div>
                </div>

                {/* Financial Loss */}
                <div className="text-[10px]">
                  <div className="flex justify-between text-aira-text-secondary mb-1">
                    <span>Expected Loss (₹ Lakh)</span>
                    <span className="font-mono font-bold">₹{sc.metrics.financial_impact_lakhs}L</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1 relative overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(sc.metrics.financial_impact_lakhs / 20) * 100}%` }}
                      className={`h-full rounded-full ${isA ? "bg-emerald-500" : "bg-red-500"}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Box */}
      <div className="mt-5 p-3.5 bg-white/5 border border-white/5 rounded-lg">
        <div className="text-[9px] uppercase font-bold text-aira-text-muted mb-1 font-mono">Digital Twin Recommendation Summary</div>
        <p className="text-xs font-mono text-aira-text leading-relaxed">
          {comparison_summary}
        </p>
      </div>
      </div>
    </div>
  );
}
