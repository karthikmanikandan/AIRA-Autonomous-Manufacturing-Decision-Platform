"use client";

import React from "react";
import { motion } from "framer-motion";
import { Database, Server, Cpu, Radio, Network } from "lucide-react";
import AgentNode from "./AgentNode";
import { AGENT_LIST } from "@/lib/constants";
import HardwareBadge from "../ui/HardwareBadge";

interface AgentCanvasProps {
  activeAgents: string[];
  negotiationIndex: number;
}

export default function AgentCanvas({
  activeAgents,
  negotiationIndex
}: AgentCanvasProps) {
  // Systems on left
  const sources = [
    { label: "ERP", icon: Database },
    { label: "MES", icon: Server },
    { label: "WMS", icon: Cpu },
    { label: "DMS", icon: Network },
    { label: "IoT Sensors", icon: Radio }
  ];

  return (
    <div className="glass-card border p-5 relative overflow-hidden flex flex-col justify-between min-h-[460px]">
      {/* Title */}
      <div className="flex justify-between items-start gap-4 z-10">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-aira-text-secondary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-aira-cyan animate-pulse" />
            Agent Collaboration Canvas
          </h3>
          <p className="text-[10px] font-mono text-aira-text-muted mt-0.5">
            LangGraph orchestrator managing multi-agent consensus pipelines
          </p>
        </div>

        {/* Compute badges */}
        <div className="flex flex-wrap gap-2">
          <HardwareBadge type="amd-rocm" />
          <HardwareBadge type="amd-cloud" />
          <HardwareBadge type="fireworks" />
        </div>
      </div>

      {/* Grid Canvas representation */}
      <div className="flex-1 grid grid-cols-12 items-center gap-6 py-6 relative">
        {/* Background circuit lines simulator */}
        <div className="absolute inset-0 grid-pattern pointer-events-none opacity-45 z-0" />

        {/* Left: Sources */}
        <div className="col-span-2 flex flex-col gap-3.5 z-10">
          <div className="text-[9px] uppercase font-bold text-aira-text-muted mb-1 text-center font-mono">Enterprise Node</div>
          {sources.map((src, i) => {
            const Icon = src.icon;
            return (
              <div 
                key={i} 
                className="flex items-center gap-2.5 px-3 py-2 bg-white/5 border border-white/5 hover:border-white/10 rounded-lg text-xs font-mono select-none"
              >
                <Icon className="w-4 h-4 text-aira-cyan shrink-0" />
                <span>{src.label}</span>
              </div>
            );
          })}
        </div>

        {/* Connection flow lines */}
        <div className="col-span-1 flex flex-col justify-around h-[80%] items-center relative z-0">
          <svg className="w-full h-full absolute inset-0 overflow-visible pointer-events-none opacity-30">
            <path d="M 0 30 Q 30 100 60 120" stroke="#06b6d4" strokeWidth="1.5" fill="none" />
            <path d="M 0 100 Q 35 120 60 120" stroke="#06b6d4" strokeWidth="1.5" fill="none" />
            <path d="M 0 170 Q 40 130 60 120" stroke="#06b6d4" strokeWidth="1.5" fill="none" />
            <path d="M 0 240 Q 35 150 60 120" stroke="#06b6d4" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        {/* Middle: Decision Engine */}
        <div className="col-span-3 flex flex-col items-center justify-center z-10">
          <motion.div 
            animate={activeAgents.length > 0 ? { 
              boxShadow: ["0 0 10px rgba(6,182,212,0.1)", "0 0 25px rgba(6,182,212,0.3)", "0 0 10px rgba(6,182,212,0.1)"] 
            } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`p-5 rounded-2xl border text-center glass-card max-w-[200px] flex flex-col items-center transition-all ${
              activeAgents.length > 0 ? "border-aira-cyan/40 bg-aira-cyan/5" : "border-white/5"
            }`}
          >
            <motion.div
              animate={activeAgents.length > 0 ? { rotate: 360 } : { rotate: 0 }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className="w-10 h-10 rounded-full border border-aira-cyan/30 flex items-center justify-center mb-3 bg-black"
            >
              <Cpu className="w-5 h-5 text-aira-cyan" />
            </motion.div>
            
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Decision Engine
            </h4>
            <span className="text-[9px] text-aira-cyan font-semibold tracking-widest uppercase font-mono mt-1">
              {activeAgents.length > 0 ? "Orchestrating..." : "Standby"}
            </span>
          </motion.div>
        </div>

        {/* Semicircle / Circle Layout of Agents on the Right */}
        <div className="col-span-6 grid grid-cols-3 gap-y-6 gap-x-4 items-center justify-center z-10 pl-6 border-l border-white/5">
          {AGENT_LIST.map((agent) => {
            const isConsulted = activeAgents.includes(agent.name);
            const isCurrentlyNegotiating = isConsulted && activeAgents[activeAgents.length - 1] === agent.name;
            
            const status = isCurrentlyNegotiating 
              ? "active" 
              : isConsulted 
              ? "complete" 
              : "idle";

            return (
              <AgentNode
                key={agent.name}
                name={agent.name}
                label={agent.label}
                iconName={agent.icon}
                status={status}
                color={agent.color}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
