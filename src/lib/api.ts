import { API_BASE_URL } from "./constants";
import { SystemHealth, FactoryMetrics, RiskEvent, AIRecommendation, ChatMessage, ChatResponse } from "./types";

async function safeFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return await res.json() as T;
  } catch (e) {
    console.error(`API error fetching ${endpoint}:`, e);
    return null;
  }
}

export async function fetchHealth(): Promise<SystemHealth | null> {
  return safeFetch<SystemHealth>("/health");
}

export async function fetchMetrics(): Promise<FactoryMetrics | null> {
  return safeFetch<FactoryMetrics>("/metrics");
}

export async function fetchEvents(): Promise<RiskEvent[] | null> {
  return safeFetch<RiskEvent[]>("/events");
}

export async function fetchRecommendations(): Promise<AIRecommendation[] | null> {
  return safeFetch<AIRecommendation[]>("/recommendations");
}

export async function fetchMCPLog(): Promise<{ log: string[] } | null> {
  return safeFetch<{ log: string[] }>("/mcp/log");
}

export async function fetchMCPActions(): Promise<any[] | null> {
  return safeFetch<any[]>("/mcp/actions");
}

export async function approveAction(actionId: string, approved: boolean, approver: string = "plant_manager"): Promise<any | null> {
  return safeFetch<any>(`/approve/${actionId}`, {
    method: "POST",
    body: JSON.stringify({ action_id: actionId, approved, approver }),
  });
}

export async function sendChatMessage(message: string, threadId: string = "default"): Promise<ChatResponse | null> {
  return safeFetch<ChatResponse>("/chat", {
    method: "POST",
    body: JSON.stringify({ message, thread_id: threadId }),
  });
}

export async function triggerDecision(eventData: any): Promise<AIRecommendation | null> {
  return safeFetch<AIRecommendation>("/decision", {
    method: "POST",
    body: JSON.stringify(eventData),
  });
}

export async function runSimulation(eventData: any): Promise<any | null> {
  return safeFetch<any>("/simulate", {
    method: "POST",
    body: JSON.stringify(eventData),
  });
}
