"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { 
  systemHealthData, 
  factoryMetricsData, 
  riskEventsData, 
  aiRecommendationsData, 
  agentNegotiationMessages, 
  mcpExecutionLogs 
} from "@/lib/mockData";
import { fetchHealth, fetchMetrics, fetchEvents, fetchRecommendations, approveAction } from "@/lib/api";

export function useSimulation() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [demoPhase, setDemoPhase] = useState(0);
  
  // Platform States
  const [healthScore, setHealthScore] = useState(94.2);
  const [healthStatus, setHealthStatus] = useState<"healthy" | "warning" | "critical">("healthy");
  const [riskEvents, setRiskEvents] = useState(riskEventsData);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [negotiationIndex, setNegotiationIndex] = useState(-1);
  const [mcpLogs, setMcpLogs] = useState<string[]>([]);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [mcpCompleted, setMcpCompleted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetDemo = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDemoPhase(0);
    setHealthScore(94.2);
    setHealthStatus("healthy");
    setRiskEvents(riskEventsData);
    setRecommendation(null);
    setActiveAgents([]);
    setNegotiationIndex(-1);
    setMcpLogs([]);
    setCopilotOpen(false);
    setMcpCompleted(false);
    setIsPlaying(true);
  }, []);

  // Demo auto-play state machine
  useEffect(() => {
    if (!isPlaying) return;

    if (demoPhase === 0) {
      // Normal state
      timerRef.current = setTimeout(() => {
        setDemoPhase(1);
      }, 3000); // 3 seconds normal operations
    } 
    
    else if (demoPhase === 1) {
      // Anomaly detected
      setHealthScore(72.0);
      setHealthStatus("warning");
      // Prepend battery anomaly
      setRiskEvents(riskEventsData);
      
      timerRef.current = setTimeout(() => {
        setDemoPhase(2);
      }, 3000);
    } 
    
    else if (demoPhase === 2) {
      // Agents activating one by one
      const agents = ["telematics", "inventory", "production", "logistics", "finance", "quality", "dealer", "maintenance", "supervisor"];
      let currentIdx = 0;
      
      const interval = setInterval(() => {
        if (currentIdx < agents.length) {
          setActiveAgents(prev => [...prev, agents[currentIdx]]);
          setNegotiationIndex(currentIdx);
          currentIdx++;
        } else {
          clearInterval(interval);
          setDemoPhase(3);
        }
      }, 1500); // Activate an agent every 1.5 seconds

      return () => clearInterval(interval);
    } 
    
    else if (demoPhase === 3) {
      // Negotiation completes, recommendation is formed
      timerRef.current = setTimeout(() => {
        setRecommendation(aiRecommendationsData[0]);
        setDemoPhase(4);
      }, 2000);
    }
  }, [demoPhase, isPlaying]);

  // MCP Execution Simulation
  const triggerApproval = useCallback(async () => {
    if (demoPhase < 4) return;
    setIsPlaying(false);
    setDemoPhase(5);
    setMcpLogs([]);
    
    // Call real backend approve endpoint in background (if online)
    try {
      await approveAction("ACT-2847", true);
    } catch {}

    // Print logs line by line
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < mcpExecutionLogs.length) {
        setMcpLogs(prev => [...prev, mcpExecutionLogs[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setMcpCompleted(true);
        // Recovery phase
        setDemoPhase(6);
        setHealthScore(91.5);
        setHealthStatus("healthy");
        // Update recommendation status
        setRecommendation((prev: any) => prev ? { ...prev, status: "executed" } : null);
      }
    }, 800); // 800ms per log line

    return () => clearInterval(interval);
  }, [demoPhase]);

  const triggerInvestigate = useCallback(() => {
    setCopilotOpen(true);
  }, []);

  return {
    isPlaying,
    demoPhase,
    healthScore,
    healthStatus,
    riskEvents,
    recommendation,
    activeAgents,
    negotiationIndex,
    mcpLogs,
    mcpCompleted,
    copilotOpen,
    setCopilotOpen,
    triggerApproval,
    triggerInvestigate,
    resetDemo
  };
}
