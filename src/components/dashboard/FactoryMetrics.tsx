"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, TrendingUp, AlertTriangle, Clock, Zap, Truck, ArrowUpRight, ArrowDownRight } from "lucide-react";
import GlassCard from "../ui/GlassCard";

interface FactoryMetricsProps {
  metrics?: {
    oee: number;
    production_rate: number;
    defect_rate: number;
    mtbf: number;
    energy_per_unit: number;
    on_time_delivery: number;
    trends: Record<string, number[]>;
  };
}

export default function FactoryMetrics({
  metrics = {
    oee: 87.3,
    production_rate: 94.2,
    defect_rate: 1.8,
    mtbf: 847,
    energy_per_unit: 12.4,
    on_time_delivery: 96.1,
    trends: {}
  }
}: FactoryMetricsProps) {
  const cards = [
    {
      label: "OEE (Overall Equipment Efficiency)",
      value: `${metrics.oee}%`,
      icon: Activity,
      color: metrics.oee >= 85 ? "text-emerald-400" : metrics.oee >= 70 ? "text-amber-400" : "text-red-400",
      trend: "+0.5%",
      isPositive: true
    },
    {
      label: "Production Output Rate",
      value: `${metrics.production_rate}%`,
      icon: TrendingUp,
      color: "text-emerald-400",
      trend: "+1.2%",
      isPositive: true
    },
    {
      label: "Production Defect Rate",
      value: `${metrics.defect_rate}%`,
      icon: AlertTriangle,
      color: metrics.defect_rate <= 2.0 ? "text-emerald-400" : "text-red-400",
      trend: "-0.08%",
      isPositive: true // lower is positive
    },
    {
      label: "Mean Time Between Failures (MTBF)",
      value: `${metrics.mtbf}h`,
      icon: Clock,
      color: "text-cyan-400",
      trend: "+14h",
      isPositive: true
    },
    {
      label: "Energy per Unit Output",
      value: `${metrics.energy_per_unit} kWh`,
      icon: Zap,
      color: "text-amber-400",
      trend: "-0.4%",
      isPositive: true // lower is positive
    },
    {
      label: "On-Time Shipping Delivery",
      value: `${metrics.on_time_delivery}%`,
      icon: Truck,
      color: "text-emerald-400",
      trend: "+0.3%",
      isPositive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <GlassCard key={idx} hoverable={true} className="flex flex-col justify-between min-h-[110px]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold uppercase tracking-wider text-aira-text-secondary">
                {c.label}
              </span>
              <Icon className={`w-4 h-4 ${c.color}`} />
            </div>
            
            <div className="flex justify-between items-end mt-4">
              <span className="text-2xl font-bold font-mono tracking-tight">{c.value}</span>
              
              <span className={`flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                c.isPositive ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"
              }`}>
                {c.isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {c.trend}
              </span>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
