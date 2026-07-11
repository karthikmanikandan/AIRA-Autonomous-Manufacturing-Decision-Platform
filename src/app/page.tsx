"use client";

import React, { useEffect, useState } from "react";
import { Cpu, RefreshCw, Terminal, HelpCircle } from "lucide-react";

// Dashboard Components
import SystemHealthIndex from "@/components/dashboard/SystemHealthIndex";
import FactoryMetrics from "@/components/dashboard/FactoryMetrics";
import RiskStream from "@/components/dashboard/RiskStream";
import AIRecommendations from "@/components/dashboard/AIRecommendations";
import AIDecisionFeed from "@/components/dashboard/AIDecisionFeed";
import ProductionHealth from "@/components/dashboard/ProductionHealth";
import EnergyConsumption from "@/components/dashboard/EnergyConsumption";

// Agent Canvas and advanced modules
import AgentCanvas from "@/components/agents/AgentCanvas";
import AgentNegotiation from "@/components/agents/AgentNegotiation";
import DigitalTwinPanel from "@/components/digital-twin/DigitalTwinPanel";
import CopilotPanel from "@/components/copilot/CopilotPanel";
import InlineChatbot from "@/components/dashboard/InlineChatbot";
import MCPTerminal from "@/components/mcp/MCPTerminal";

import { useSimulation } from "@/hooks/useSimulation";
import { fetchHealth, fetchMetrics, fetchEvents, fetchRecommendations, triggerDecision } from "@/lib/api";

export default function Home() {
  const {
    demoPhase,
    healthScore,
    healthStatus,
    riskEvents,
    recommendation,
    activeAgents,
    negotiationIndex,
    mcpLogs,
    copilotOpen,
    setCopilotOpen,
    triggerApproval,
    triggerInvestigate,
    resetDemo
  } = useSimulation();

  // Dynamic state hooks for live backend integration
  const [liveHealth, setLiveHealth] = useState<any>(null);
  const [liveMetrics, setLiveMetrics] = useState<any>(null);
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [liveRecommendations, setLiveRecommendations] = useState<any[]>([]);

  // Fetch real-time live database updates from FastAPI in background
  useEffect(() => {
    async function updateLiveStates() {
      try {
        const h = await fetchHealth();
        if (h) setLiveHealth(h);
        
        const m = await fetchMetrics();
        if (m) setLiveMetrics(m);
        
        const ev = await fetchEvents();
        if (ev) setLiveEvents(ev);
        
        const rec = await fetchRecommendations();
        if (rec) setLiveRecommendations(rec);
      } catch (err) {
        console.error("Error fetching live backend states:", err);
      }
    }
    
    updateLiveStates();
    const interval = setInterval(updateLiveStates, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen grid-pattern bg-aira-bg text-aira-text pb-12 select-none relative">
      {/* Top Navigation */}
      <header className="border-b border-white/5 bg-black/40 px-6 py-4.5 flex justify-between items-center select-none z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-aira-cyan to-aira-purple flex items-center justify-center shadow-lg glow-cyan">
            <Cpu className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white font-mono flex items-center gap-2">
              AIRA 
              <span className="text-[10px] text-aira-cyan bg-aira-cyan/10 border border-aira-cyan/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Autonomous Manufacturing Platform
              </span>
            </h1>
            <p className="text-[10px] text-aira-text-muted mt-0.5 font-mono">
              LANGGRAPH AGENTS + FIREWORKS REASONING + AMD DEVELOPER CLOUD CLUSTER
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={resetDemo}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-white/5 hover:border-white/10 rounded-lg text-xs font-mono text-aira-text-secondary hover:text-white cursor-pointer bg-white/5 active:scale-[0.96] transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Demo Flow
          </button>

          <button 
            onClick={triggerInvestigate}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-aira-cyan/25 text-aira-cyan hover:bg-aira-cyan/5 rounded-lg text-xs font-mono cursor-pointer active:scale-[0.96] transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Open Copilot
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="max-w-[1600px] mx-auto px-6 mt-6 grid grid-cols-12 gap-6 relative z-10">
        
        {/* Row 1: Executive Summary */}
        <div className="col-span-12 lg:col-span-3">
          <SystemHealthIndex 
            score={liveHealth?.score || healthScore} 
            status={liveHealth?.status || healthStatus} 
            subsystems={liveHealth?.subsystems}
          />
        </div>
        
        <div className="col-span-12 lg:col-span-9 flex flex-col justify-between gap-6">
          <FactoryMetrics metrics={liveMetrics || undefined} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            <ProductionHealth />
            <EnergyConsumption />
          </div>
        </div>

        {/* Row 2: Agent Canvas & Negotiation (Centerpiece) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 h-full">
          <AgentCanvas 
            activeAgents={activeAgents} 
            negotiationIndex={negotiationIndex}
          />
          <InlineChatbot />
        </div>

        <div className="col-span-12 lg:col-span-4 h-full">
          <AgentNegotiation negotiationIndex={negotiationIndex} />
        </div>

        {/* Row 3: Decision Proposals, Digital Twin & Execution Logs */}
        <div className="col-span-12 lg:col-span-4 h-full">
          <AIRecommendations 
            recommendations={liveRecommendations.length > 0 ? liveRecommendations : (recommendation ? [recommendation] : null)}
            onApprove={triggerApproval}
            onInvestigate={triggerInvestigate}
            demoPhase={demoPhase}
          />
        </div>

        <div className="col-span-12 lg:col-span-5 h-full">
          <DigitalTwinPanel />
        </div>

        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 h-full">
          <MCPTerminal logs={mcpLogs} />
          <AIDecisionFeed />
        </div>

        {/* Row 4: Live Event Logging Stream */}
        <div className="col-span-12">
          <RiskStream events={liveEvents.length > 0 ? liveEvents : riskEvents} />
        </div>

      </div>

      {/* Side Slide-out Chat Panel */}
      <CopilotPanel isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />
    </main>
  );
}
