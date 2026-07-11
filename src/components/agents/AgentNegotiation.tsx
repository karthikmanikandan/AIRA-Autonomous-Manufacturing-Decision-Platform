"use client";

import React, { useEffect, useRef } from "react";
import { MessageSquare, Cpu } from "lucide-react";
import { agentNegotiationMessages } from "@/lib/mockData";
import { AGENT_LIST } from "@/lib/constants";

interface AgentNegotiationProps {
  negotiationIndex: number;
}

export default function AgentNegotiation({
  negotiationIndex
}: AgentNegotiationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when negotiation updates
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [negotiationIndex]);

  const getAgentLabelColor = (name: string) => {
    const found = AGENT_LIST.find(a => a.name === name);
    return found ? found.color : "#94A3B8";
  };

  const getAgentLabel = (name: string) => {
    const found = AGENT_LIST.find(a => a.name === name);
    return found ? found.label : name;
  };

  return (
    <div className="glass-card border p-4 flex flex-col h-full min-h-[380px]">
      <h3 className="text-xs font-bold uppercase tracking-wider text-aira-text-secondary mb-3 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-aira-cyan" />
        Agent Negotiation Hub
      </h3>

      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-3.5 pr-1 select-none font-mono text-xs"
      >
        {negotiationIndex === -1 ? (
          <div className="flex flex-col items-center justify-center text-center text-aira-text-muted h-full py-8">
            <Cpu className="w-6 h-6 mb-1.5 animate-spin" />
            <span>Awaiting telemetry warning to begin collaboration...</span>
          </div>
        ) : (
          agentNegotiationMessages.slice(0, negotiationIndex + 1).map((msg, idx) => {
            const color = getAgentLabelColor(msg.agent);
            const label = getAgentLabel(msg.agent);
            
            return (
              <div 
                key={idx} 
                className="bg-white/5 border border-white/5 p-3 rounded-lg flex flex-col gap-1 hover:border-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="font-bold" style={{ color }}>{label}</span>
                  <span className="text-[10px] text-aira-text-muted ml-auto">14:00:3{idx}</span>
                </div>
                <p className="text-aira-text-secondary text-[11px] leading-relaxed pl-4">
                  {msg.text}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
