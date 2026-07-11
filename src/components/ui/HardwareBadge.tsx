"use client";

import React from "react";
import { Cpu, Cloud, Zap } from "lucide-react";

interface HardwareBadgeProps {
  type: "amd-rocm" | "amd-cloud" | "fireworks";
}

export default function HardwareBadge({ type }: HardwareBadgeProps) {
  const configs = {
    "amd-rocm": {
      label: "AMD ROCm Core",
      detail: "AMD Instinct™ MI300X • ROCm Stack",
      icon: Cpu,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    "amd-cloud": {
      label: "AMD Developer Cloud Cluster",
      detail: "GPU Cluster • vLLM Inference",
      icon: Cloud,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    "fireworks": {
      label: "Fireworks AI Serverless",
      detail: "Llama 3.3 70B • Reasoning Tool",
      icon: Zap,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    }
  }[type];

  const Icon = configs.icon;

  return (
    <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs font-medium glass-card ${configs.color}`}>
      <Icon className="w-4 h-4 shrink-0" />
      <div>
        <div className="font-bold uppercase tracking-wider text-[10px]">{configs.label}</div>
        <div className="opacity-80 font-mono text-[9px]">{configs.detail}</div>
      </div>
    </div>
  );
}
