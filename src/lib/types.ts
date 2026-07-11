export interface SystemHealth {
  score: number;
  status: "healthy" | "warning" | "critical";
  subsystems: Record<string, number>;
  last_updated: string;
}

export interface FactoryMetrics {
  oee: number;
  production_rate: number;
  defect_rate: number;
  mtbf: number;
  energy_per_unit: number;
  on_time_delivery: number;
  trends: Record<string, number[]>;
}

export interface RiskEvent {
  event_id: string;
  event_type: string;
  source: "ERP" | "MES" | "WMS" | "DMS" | "IoT" | "Telematics" | "System";
  severity: "critical" | "warning" | "info";
  description: string;
  timestamp: string;
  data: Record<string, any>;
}

export interface RecommendedAction {
  action: string;
  target_system: string;
  priority: string;
  estimated_impact: string;
}

export interface BusinessImpact {
  cost_savings: string;
  downtime_avoided: string;
  production_impact: string;
  delivery_impact: string;
}

export interface AIRecommendation {
  decision_id: string;
  summary: string;
  recommended_actions: RecommendedAction[];
  business_impact: BusinessImpact;
  confidence: number;
  agents_involved: string[];
  evidence: string[];
  status: "pending" | "approved" | "executed" | "rejected";
  digital_twin?: any;
}

export interface AgentStatus {
  agent: string;
  status: "idle" | "active" | "complete";
  task: string;
}

export interface MCPLogEntry {
  line: string;
  timestamp: string;
  type: string;
}

export interface ChartData {
  type: "bar" | "pie" | "line";
  title: string;
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  charts?: ChartData[];
  agent_name?: string;
}

export interface ChatResponse {
  response: string;
  charts?: ChartData[];
  agent_name?: string;
}

export interface ProductionLine {
  name: string;
  status: "running" | "maintenance" | "idle";
  utilization: number;
  current_product: string;
  next_maintenance: string;
}

export interface DealerInfo {
  id: string;
  name: string;
  order: string;
  sla_hours: number;
}
