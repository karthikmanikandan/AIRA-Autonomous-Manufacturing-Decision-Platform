"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, TrendingUp, HelpCircle } from "lucide-react";
import { AIRecommendation } from "@/lib/types";

interface AIRecommendationsProps {
  recommendations: AIRecommendation[] | null;
  onApprove: () => void;
  onReject?: () => void;
  onInvestigate: () => void;
  demoPhase?: number;
}

export default function AIRecommendations({
  recommendations,
  onApprove,
  onReject,
  onInvestigate,
  demoPhase = 0
}: AIRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="glass-card border p-6 flex flex-col items-center justify-center text-center h-full min-h-[220px]">
        <HelpCircle className="w-8 h-8 text-aira-text-muted mb-2 animate-bounce" />
        <p className="text-sm font-mono text-aira-text-secondary">
          Decision Engine: Idle. Awaiting anomaly signals...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      {recommendations.map((rec) => {
        const isExecuted = rec.status === "executed";
        const isPending = rec.status === "pending";
        
        return (
          <motion.div
            key={rec.decision_id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`glass-card border p-5 relative overflow-hidden flex-1 flex flex-col justify-between ${
              isPending ? "border-red-500/25 glow-red" : "border-emerald-500/20"
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase tracking-widest ${
                  isPending ? "bg-red-500/10 text-red-400 border border-red-500/25" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                }`}>
                  {isPending ? "Critical Priority" : "Approved & Active"}
                </span>
                <h4 className="text-base font-bold tracking-tight text-white mt-2">
                  {rec.summary}
                </h4>
              </div>
              
              {/* Confidence score indicator */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-full py-1 px-3">
                <span className="text-[10px] text-aira-text-secondary font-medium">Confidence:</span>
                <span className="text-xs font-mono font-bold text-aira-cyan">{rec.confidence}%</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 my-4 space-y-4">
              {/* Evidence details */}
              <div className="border-y border-white/5 py-3 space-y-1.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-aira-text-muted">Evidence logs</div>
                {rec.evidence.map((ev, i) => (
                  <div key={i} className="text-xs font-mono text-aira-text flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-400 rounded-full shrink-0" />
                    {ev}
                  </div>
                ))}
              </div>

              {/* Proposed actions workflow */}
              <div className="space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-wider text-aira-text-muted">MCP staged write parameters</div>
                {rec.recommended_actions.map((act, i) => (
                  <div key={i} className="flex justify-between items-center text-xs font-mono bg-white/5 px-3 py-2 rounded border border-white/5">
                    <span className="text-white font-medium">{act.action}</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-slate-500/10 border border-slate-500/20 text-aira-text-secondary font-bold uppercase rounded">
                      {act.target_system}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial ROI and downtime metric badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                <div className="bg-emerald-500/5 border border-emerald-500/15 rounded p-2 text-center">
                  <div className="text-[9px] uppercase font-bold text-aira-text-muted">Cost Savings</div>
                  <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">{rec.business_impact.cost_savings}</div>
                </div>
                <div className="bg-cyan-500/5 border border-cyan-500/15 rounded p-2 text-center">
                  <div className="text-[9px] uppercase font-bold text-aira-text-muted">Downtime Saved</div>
                  <div className="text-sm font-mono font-bold text-cyan-400 mt-0.5">{rec.business_impact.downtime_avoided}</div>
                </div>
                <div className="bg-purple-500/5 border border-purple-500/15 rounded p-2 text-center">
                  <div className="text-[9px] uppercase font-bold text-aira-text-muted">Production Shift</div>
                  <div className="text-sm font-mono font-bold text-purple-400 mt-0.5">{rec.business_impact.production_impact}</div>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/15 rounded p-2 text-center">
                  <div className="text-[9px] uppercase font-bold text-aira-text-muted">Delivery SLA</div>
                  <div className="text-sm font-mono font-bold text-blue-400 mt-0.5">{rec.business_impact.delivery_impact}</div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-5">
              {isPending ? (
                <>
                  <button
                    onClick={onApprove}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] transition-all text-white font-bold text-xs py-2 px-4 rounded-lg shadow-lg cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Approve MCP Action
                  </button>
                  
                  <button
                    onClick={onInvestigate}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-aira-cyan/30 text-aira-cyan hover:bg-aira-cyan/5 active:scale-[0.98] transition-all font-bold text-xs py-2 px-4 rounded-lg cursor-pointer"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Investigate
                  </button>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 animate-bounce" />
                  Staged Actions Safely Completed via MCP
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
