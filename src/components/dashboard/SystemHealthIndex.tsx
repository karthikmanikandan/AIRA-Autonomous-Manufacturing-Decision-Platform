"use client";

import React from "react";
import { motion } from "framer-motion";
import PulsingDot from "../ui/PulsingDot";

interface SystemHealthIndexProps {
  score: number;
  status: "healthy" | "warning" | "critical";
  subsystems?: Record<string, number>;
}

export default function SystemHealthIndex({
  score,
  status,
  subsystems = {
    "ERP (Ramco Systems)": 98.0,
    "MES (Production)": 96.0,
    "WMS (Warehouse)": 94.0,
    "DMS (Dealers)": 92.0,
    "IoT Sensors": 97.0,
    "Telematics": 89.0
  }
}: SystemHealthIndexProps) {
  const colorMap = {
    healthy: "text-emerald-500 stroke-emerald-500",
    warning: "text-amber-500 stroke-amber-500",
    critical: "text-red-500 stroke-red-500"
  }[status];

  const glowClass = {
    healthy: "glow-emerald border-emerald-500/10",
    warning: "glow-amber border-amber-500/10",
    critical: "glow-red border-red-500/10"
  }[status];

  // Circle path parameters
  const radius = 70;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-card border h-full">
      <h3 className="text-sm font-bold uppercase tracking-wider text-aira-text-secondary mb-4 flex items-center gap-2">
        <PulsingDot status={status} size="sm" />
        System Health Index
      </h3>

      <div className={`relative flex items-center justify-center rounded-full p-4 transition-all duration-500 ${glowClass}`}>
        <svg className="w-40 h-40 transform -rotate-90">
          {/* Base Background Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active Filling Progress Track */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            strokeWidth={strokeWidth}
            fill="transparent"
            className={`${colorMap}`}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        {/* Core Value */}
        <div className="absolute text-center">
          <div className="text-4xl font-extrabold font-mono tracking-tight">{score}%</div>
          <div className={`text-[10px] font-bold uppercase tracking-wider ${colorMap}`}>{status}</div>
        </div>
      </div>

      {/* Subsystem Health Logs */}
      <div className="w-full mt-6 space-y-2">
        {Object.entries(subsystems).map(([sub, val]) => (
          <div key={sub} className="text-xs">
            <div className="flex justify-between text-aira-text-secondary mb-1">
              <span>{sub}</span>
              <span className="font-mono">{val}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1 relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${val}%` }}
                transition={{ duration: 0.8 }}
                className={`h-full rounded-full ${
                  val >= 90 ? "bg-emerald-500" : val >= 75 ? "bg-amber-500" : "bg-red-500"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
