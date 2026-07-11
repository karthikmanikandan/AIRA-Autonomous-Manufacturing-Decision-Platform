"use client";

import React from "react";
import { User, Cpu } from "lucide-react";
import { ChatMessage as ChatMessageType } from "@/lib/types";
import ChartRenderer from "./ChartRenderer";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  const renderContent = (content: string) => {
    // Simple markdown parses for **bold** text and lists
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      let styled = line;
      // Bold tags regex replacement
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        // Add plain text before match
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        // Add styled bold match
        parts.push(
          <strong key={match.index} className="text-white font-extrabold">
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }

      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      // Check if it's a list item
      const isBullet = line.trim().startsWith("-");
      
      return (
        <p key={idx} className={`text-xs leading-relaxed font-mono ${isBullet ? "pl-4 text-aira-text-secondary" : ""}`}>
          {isBullet && <span className="text-aira-cyan mr-1.5">•</span>}
          {parts.length > 0 ? parts : styled}
        </p>
      );
    });
  };

  return (
    <div className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full border shrink-0 flex items-center justify-center ${
        isUser 
          ? "bg-aira-cyan/10 border-aira-cyan/20 text-aira-cyan" 
          : "bg-purple-500/10 border-purple-500/20 text-purple-400"
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Cpu className="w-4 h-4 animate-pulse" />}
      </div>

      {/* Message bubble */}
      <div className={`flex flex-col gap-1.5 p-3.5 rounded-xl border ${
        isUser 
          ? "bg-aira-cyan/5 border-aira-cyan/20 text-white rounded-tr-none" 
          : "bg-white/5 border-white/5 text-aira-text-secondary rounded-tl-none"
      }`}>
        {/* Agent attribution header */}
        {!isUser && (
          <span className="text-[9px] uppercase font-bold tracking-widest text-purple-400 font-mono">
            AIRA Platform Supervisor
          </span>
        )}
        
        {/* Text */}
        <div className="space-y-1.5">{renderContent(message.content)}</div>

        {/* Dynamic inline chart renderer */}
        {message.charts && <ChartRenderer charts={message.charts} />}
      </div>
    </div>
  );
}
