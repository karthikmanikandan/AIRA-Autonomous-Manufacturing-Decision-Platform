"use client";

import React from "react";
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartData } from "@/lib/types";

interface ChartRendererProps {
  charts: ChartData[];
}

const PIE_COLORS = ["#10B981", "#06B6D4", "#F59E0B", "#8B5CF6"];

export default function ChartRenderer({ charts }: ChartRendererProps) {
  if (!charts || charts.length === 0) return null;

  return (
    <div className="space-y-6 mt-4 w-full select-none font-sans">
      {charts.map((chart, idx) => {
        const isBar = chart.type === "bar";
        const isPie = chart.type === "pie";
        const isLine = chart.type === "line";
        
        return (
          <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-xl">
            <h5 className="text-xs font-bold text-white mb-3 text-center tracking-tight">
              {chart.title}
            </h5>
            
            <div className="h-44 w-full">
              {isBar && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chart.data} margin={{ left: -20, right: 10 }}>
                    <XAxis dataKey={chart.xKey} tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} />
                    <Tooltip
                      contentStyle={{ background: "#0a0a0f", borderColor: "rgba(255,255,255,0.08)", fontSize: 10, fontFamily: "monospace" }}
                    />
                    <Bar dataKey={chart.yKey} fill={chart.color || "#10B981"} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {isPie && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chart.data}
                      dataKey={chart.yKey}
                      nameKey={chart.xKey}
                      cx="50%"
                      cy="50%"
                      outerRadius={55}
                      fill="#8884d8"
                      label={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }}
                    >
                      {chart.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#0a0a0f", borderColor: "rgba(255,255,255,0.08)", fontSize: 10, fontFamily: "monospace" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}

              {isLine && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chart.data} margin={{ left: -20, right: 10 }}>
                    <XAxis dataKey={chart.xKey} tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} />
                    <Tooltip
                      contentStyle={{ background: "#0a0a0f", borderColor: "rgba(255,255,255,0.08)", fontSize: 10, fontFamily: "monospace" }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey={chart.yKey} 
                      stroke={chart.color || "#EF4444"} 
                      strokeWidth={2}
                      dot={{ r: 3, fill: chart.color || "#EF4444" }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
