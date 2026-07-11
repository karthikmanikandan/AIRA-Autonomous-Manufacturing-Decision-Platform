"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";

interface MCPTerminalProps {
  logs: string[];
}

export default function MCPTerminal({ logs }: MCPTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = React.useState(true);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    // Check if user is near the bottom (within 35px threshold)
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 35;
    setShouldAutoScroll(isAtBottom);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container && shouldAutoScroll) {
      container.scrollTop = container.scrollHeight;
    }
  }, [logs, shouldAutoScroll]);

  const getLogStyle = (line: string) => {
    if (line.includes("✓") || line.includes("SUCCESS")) return "text-emerald-400";
    if (line.includes("✗") || line.includes("ERROR")) return "text-red-400 font-bold";
    if (line.includes("AUTH") || line.includes("⏳")) return "text-amber-400";
    if (line.includes("MCP:READ")) return "text-cyan-400";
    if (line.includes("MCP:WRITE")) return "text-emerald-300 font-medium";
    if (line.includes("RBAC")) return "text-purple-400";
    if (line.includes("AUDIT")) return "text-blue-400";
    return "text-slate-400";
  };

  return (
    <div className="glass-card border p-4 bg-[#050508] flex-1 min-h-[220px] h-0 flex flex-col font-mono">
      {/* Terminal Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-2.5 mb-3 select-none">
        <div className="flex items-center gap-2 text-xs font-bold text-aira-text-secondary">
          <Terminal className="w-4 h-4 text-aira-cyan" />
          Autonomous Execution Terminal (MCP Client)
        </div>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/30" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 animate-pulse" />
        </div>
      </div>

      {/* Terminal Body */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto text-xs leading-relaxed space-y-1.5 pr-1 select-text"
      >
        {logs.length === 0 ? (
          <div className="text-aira-text-muted flex flex-col items-center justify-center h-full py-8 select-none">
            <span className="animate-pulse">_ Awaiting MCP write permission transaction payload...</span>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {logs.map((line, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className={`break-words tracking-tight ${getLogStyle(line)}`}
              >
                {line}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
