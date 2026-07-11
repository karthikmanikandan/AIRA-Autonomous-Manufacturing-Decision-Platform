"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Cpu, Loader2, MessageSquare } from "lucide-react";
import { ChatMessage as ChatMessageType, ChartData } from "@/lib/types";
import { sendChatMessage } from "@/lib/api";
import { telematicsTimeSeriesData, salesData, salesByRegionData } from "@/lib/mockData";
import ChatMessage from "../copilot/ChatMessage";

export default function InlineChatbot() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      role: "assistant",
      content: "Hello! I am the inline AIRA Copilot. Ask me about **sales performance** or **telematics battery data** to render live charts."
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
    
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      // Try to get response from real backend
      const res = await sendChatMessage(userMsg);
      if (res && res.response) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: res.response,
          charts: res.charts as ChartData[]
        }]);
      } else {
        // Fallback local response simulation
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
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card border p-4 flex flex-col flex-1 min-h-[380px] h-0">
      {/* Header */}
      <div className="flex justify-between items-center pb-2.5 mb-3 border-b border-white/5 select-none">
        <div className="flex items-center gap-2 text-xs font-bold text-aira-text-secondary">
          <MessageSquare className="w-4 h-4 text-aira-cyan animate-pulse" />
          AIRA Chatbot Copilot
        </div>
        <span className="text-[9px] font-mono text-aira-text-muted bg-white/5 border border-white/5 px-2 py-0.5 rounded">
          Llama 3.3 70B • Temperature: 0.3
        </span>
      </div>

      {/* Message List */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto space-y-4 pr-1 mb-3"
      >
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
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

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-white/5 pt-3 bg-black/10">
        <input
          type="text"
          placeholder="Ask about sales, telematics, or battery failure..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 bg-[#0d0d12] border border-white/5 focus:border-aira-cyan/35 rounded-lg px-3.5 py-2 text-xs text-white placeholder-aira-text-muted focus:outline-none font-mono"
        />
        <button 
          onClick={handleSend}
          className="p-2 rounded-lg bg-aira-cyan hover:bg-cyan-500 active:scale-[0.96] text-black font-bold cursor-pointer transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
