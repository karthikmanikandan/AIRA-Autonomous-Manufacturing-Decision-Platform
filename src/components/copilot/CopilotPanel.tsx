"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Cpu, Loader2 } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { ChatMessage as ChatMessageType, ChartData } from "@/lib/types";
import { sendChatMessage } from "@/lib/api";
import { telematicsTimeSeriesData, salesData, salesByRegionData } from "@/lib/mockData";

interface CopilotPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CopilotPanel({ isOpen, onClose }: CopilotPanelProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      role: "assistant",
      content: "Welcome to the AIRA Operations Copilot. Click **Investigate** on any dashboard anomaly, or ask me directly about current factory KPIs, inventory reserves, or sales distribution."
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    // Check if user is near the bottom (within 40px threshold)
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 40;
    setShouldAutoScroll(isAtBottom);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container && shouldAutoScroll) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isLoading, shouldAutoScroll]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMsg = inputValue.trim();
    setInputValue("");
    
    // Append User Message
    const userMessageObj: ChatMessageType = { role: "user", content: userMsg };
    setMessages(prev => [...prev, userMessageObj]);
    setIsLoading(true);

    try {
      // 1. Call backend API
      const res = await sendChatMessage(userMsg);
      
      if (res && res.response) {
        // Append AI response
        setMessages(prev => [...prev, {
          role: "assistant",
          content: res.response,
          charts: res.charts as ChartData[]
        }]);
      } else {
        // Fallback local simulation logic
        setTimeout(() => {
          let responseText = "";
          let charts: ChartData[] | undefined = undefined;
          const msgLower = userMsg.toLowerCase();

          if (msgLower.includes("sales") || msgLower.includes("revenue") || msgLower.includes("region")) {
            responseText = "Here is the sales performance data for the last 6 months. Sales grew from 4,120 units in January to 5,950 units in June. Regionally, the South Zone represents our largest market segment at 40%, followed by the North Zone at 35%.";
            charts = [
              {
                type: "bar",
                title: "Sales Output (Last 6 Months)",
                data: salesData,
                xKey: "month",
                yKey: "revenue_lakhs",
                color: "#10B981"
              },
              {
                type: "pie",
                title: "Sales Share by Region",
                data: salesByRegionData,
                xKey: "name",
                yKey: "value",
                color: "#06B6D4"
              }
            ];
          } else if (msgLower.includes("battery") || msgLower.includes("why") || msgLower.includes("temperature") || msgLower.includes("reason")) {
            responseText = "The recommendation was generated because truck **TRK-2847** showed a critical battery temperature increase of **+41%** (78.4°C vs 55°C limit). Historical correlations show an **87-case correlation** with thermal failure. Immediate replacement during the scheduled Line 3 break at 14:00 avoids ₹19 lakh in losses and 14 hours of downtime.";
            charts = [
              {
                type: "line",
                title: "Battery Telemetry (Last 24 Hours)",
                data: telematicsTimeSeriesData,
                xKey: "time",
                yKey: "battery_temp",
                color: "#EF4444"
              }
            ];
          } else {
            responseText = "I am the AIRA Autonomous Manufacturing AI Copilot. I monitor operations and help verify decision workflows, digital twin simulations, and MCP integrations. Let me know if you would like me to show Sales or Telematics charts.";
          }

          setMessages(prev => [...prev, {
            role: "assistant",
            content: responseText,
            charts
          }]);
          setIsLoading(false);
        }, 1500);
        return;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-[460px] bg-[#07070a] border-l border-white/5 shadow-2xl z-50 flex flex-col justify-between"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4.5 py-4 border-b border-white/5 select-none bg-black/40">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-aira-cyan animate-pulse" />
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">AIRA Copilot</h4>
                <p className="text-[10px] text-aira-text-muted font-mono">Connected to Llama 3.3 70B</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-aira-text-secondary hover:text-white cursor-pointer transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation list */}
          <div 
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-4 pr-2.5"
          >
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 max-w-[85%] mr-auto items-center">
                <div className="w-8 h-8 rounded-full border shrink-0 flex items-center justify-center bg-purple-500/10 border-purple-500/20 text-purple-400">
                  <Cpu className="w-4 h-4 animate-spin" />
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl border bg-white/5 border-white/5 text-xs text-aira-text-muted font-mono">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Reasoning on compute cluster...
                </div>
              </div>
            )}
          </div>

          {/* Input Panel */}
          <div className="p-4 border-t border-white/5 bg-black/40 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask a question or request charts..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-[#101016] border border-white/5 focus:border-aira-cyan/35 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-aira-text-muted focus:outline-none font-mono"
            />
            <button 
              onClick={handleSend}
              className="p-2.5 rounded-lg bg-aira-cyan hover:bg-cyan-500 active:scale-[0.96] text-black font-bold cursor-pointer transition-all shrink-0"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
