from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class EventData(BaseModel):
    event_id: str
    event_type: str
    source: str
    severity: str
    data: Dict[str, Any]
    timestamp: str
    description: str

class AgentResponse(BaseModel):
    agent_name: str
    analysis: str
    confidence: float
    recommendations: List[str]
    data: Optional[Dict[str, Any]] = None

class RecommendedAction(BaseModel):
    action: str
    target_system: str
    priority: str
    estimated_impact: str

class DecisionResponse(BaseModel):
    decision_id: str
    summary: str
    recommended_actions: List[Dict[str, Any]]
    business_impact: Dict[str, Any]
    confidence: float
    agents_involved: List[str]
    evidence: List[str]
    digital_twin: Optional[Dict[str, Any]] = None
    status: str = "pending"  # pending, approved, executed

class SimulationScenario(BaseModel):
    name: str
    description: str
    metrics: Dict[str, Any]  # downtime_hours, production_loss_pct, financial_impact_lakhs, deliveries_delayed, confidence

class SimulationResult(BaseModel):
    scenarios: List[SimulationScenario]
    recommendation: str
    comparison_summary: str

class MCPAction(BaseModel):
    action_id: str
    action_type: str
    target_system: str
    description: str
    payload: Dict[str, Any]
    status: str = "pending"  # pending, approved, rejected, executed
    requires_approval: bool = True
    audit_log: List[str] = []

class ChatRequest(BaseModel):
    message: str
    thread_id: str = "default"

class ChatResponse(BaseModel):
    response: str
    charts: Optional[List[Dict[str, Any]]] = None  # [{type: bar/pie/line, data: [...], title: str, xKey: str, yKey: str}]
    agent_name: Optional[str] = None

class ApprovalRequest(BaseModel):
    action_id: str
    approved: bool
    approver: str = "plant_manager"

class SystemHealth(BaseModel):
    score: float
    status: str
    subsystems: Dict[str, float]
    last_updated: str

class FactoryMetrics(BaseModel):
    oee: float
    production_rate: float
    defect_rate: float
    mtbf: float
    energy_per_unit: float
    on_time_delivery: float
    trends: Dict[str, List[float]]
