"use client";

import React from "react";
import { Zap, ArrowDown } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { time: "00:00", kwh: 12.1 },
  { time: "04:00", kwh: 11.5 },
  { time: "08:00", kwh: 14.8 },
  { time: "12:00", kwh: 13.9 },
  { time: "16:00", kwh: 12.4 },
  { time: "20:00", kwh: 11.2 }
];

export default function EnergyConsumption() {
  return (
    <div className="glass-card border p-4 flex flex-col justify-between h-full min-h-[170px]">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-aira-text-secondary mb-2.5 flex items-center gap-2">
          <Zap className="w-4 h-4 text-aira-amber" />
          Energy Consumption
        </h3>
        
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-2xl font-bold font-mono tracking-tight">12.4 kWh</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full flex items-center font-mono">
            <ArrowDown className="w-3 h-3 mr-0.5" />
            -4.2%
          </span>
        </div>
      </div>

      <div className="h-20 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 2, right: 2, left: -25, bottom: 2 }}>
            <defs>
              <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip
              contentStyle={{ background: "#0a0a0f", borderColor: "rgba(255,255,255,0.08)", fontSize: 10, fontFamily: "monospace" }}
              labelClassName="text-white"
            />
            <Area type="monotone" dataKey="kwh" stroke="#f59e0b" strokeWidth={1.5} fillOpacity={1} fill="url(#colorKwh)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
