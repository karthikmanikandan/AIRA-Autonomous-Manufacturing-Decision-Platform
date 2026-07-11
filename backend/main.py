from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import json
import asyncio
from datetime import datetime
from typing import List, Dict, Any

from backend.config import FIREWORKS_API_KEY, FIREWORKS_MODEL, LLM_TEMPERATURE, LLM_MAX_TOKENS
from backend.models.schemas import (
    ChatRequest, ChatResponse, EventData, DecisionResponse,
    ApprovalRequest, SystemHealth, FactoryMetrics
)
from backend.data.mock_data import (
    SYSTEM_HEALTH, SALES_DATA, SALES_BY_REGION, INVENTORY_DATA,
    PRODUCTION_LINES, DEALER_DATA, RISK_EVENTS, AI_RECOMMENDATIONS,
    DIGITAL_TWIN_SCENARIOS, AGENT_ANALYSIS, get_live_metrics,
    get_live_telematics_data
)
from backend.graph.decision_engine import process_event
from backend.digital_twin.simulator import simulate_scenarios
from backend.mcp.client import mcp_client

app = FastAPI(title="AIRA — Autonomous Manufacturing Decision Platform")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. System Health Endpoint
@app.get("/api/health", response_model=SystemHealth)
def get_system_health():
    health = SYSTEM_HEALTH.copy()
    health["last_updated"] = datetime.now().strftime("%H:%M:%S")
    return health

# 2. Live Factory Metrics
@app.get("/api/metrics", response_model=FactoryMetrics)
def get_factory_metrics():
    # Calculated dynamically from the smart manufacturing process dataset
    return get_live_metrics()

# 3. Live Events Stream
@app.get("/api/events")
def get_events():
    events = RISK_EVENTS.copy()
    # Update timestamp of the primary battery alert dynamically to stay fresh
    events[0]["timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return events

# 4. Live AI Recommendations
@app.get("/api/recommendations")
def get_recommendations():
    return AI_RECOMMENDATIONS

# 5. MCP Approval Queue
@app.get("/api/mcp/actions")
def get_mcp_actions():
    return mcp_client.get_approval_queue()

# 6. MCP Execution Log
@app.get("/api/mcp/log")
def get_mcp_log():
    return {"log": mcp_client.get_execution_log()}

# 7. Action Approvals
@app.post("/api/approve/{action_id}")
def approve_action(action_id: str, req: ApprovalRequest):
    if req.approved:
        updated = mcp_client.approve_action(action_id, req.approver)
    else:
        updated = mcp_client.reject_action(action_id, req.approver)
    return updated

# 8. Digital Twin Simulation
@app.post("/api/simulate")
def run_simulation(event_data: Dict[str, Any]):
    return simulate_scenarios(event_data, "Immediate Mobile Maintenance Replacement")

# 9. LangGraph Decision Workflow trigger
@app.post("/api/decision")
async def trigger_decision(event: EventData):
    decision = await process_event(event.model_dump())
    return decision

# 10. AI Copilot Chat Endpoint (Connected to Fireworks AI)
@app.post("/api/chat", response_model=ChatResponse)
def copilot_chat(req: ChatRequest):
    msg = req.message.lower()
    
    # 1. Parse charts request
    charts = None
    
    # If user requests sales
    if "sales" in msg or "revenue" in msg or "region" in msg or "perform" in msg:
        charts = [
            {
                "type": "bar",
                "title": "Sales Output (Last 6 Months)",
                "data": SALES_DATA,
                "xKey": "month",
                "yKey": "revenue_lakhs",
                "color": "#10B981"
            },
            {
                "type": "pie",
                "title": "Sales Share by Region",
                "data": SALES_BY_REGION,
                "xKey": "name",
                "yKey": "value",
                "color": "#06B6D4"
            }
        ]
        
    # If user requests telematics/sensor battery data
    elif "telematics" in msg or "battery" in msg or "temperature" in msg or "truck" in msg or "rpm" in msg or "vibration" in msg:
        charts = [
            {
                "type": "line",
                "title": "Battery Telemetry (Last 24 Hours)",
                "data": get_live_telematics_data(),
                "xKey": "time",
                "yKey": "battery_temp",
                "color": "#EF4444"
            }
        ]
        
    # 2. Invoke Fireworks AI Llama 3.3 70B model
    system_prompt = """You are the AI Copilot for AIRA (Autonomous Manufacturing Decision Platform).
    Your purpose is to assist operations executives and plant managers with manufacturing intelligence.
    
    Always reference the core agent findings:
    - Telematics Agent detected a battery temperature spike (+41%, 78.4°C) on TRK-2847.
    - Inventory confirmed spare parts in Warehouse B, Slot R4-C2 (3 in stock).
    - Production Agent identified ascheduled Line 3 break window at 14:00.
    - Finance Agent projects ₹19L loss if delayed, but only ₹0.3L cost if replaced immediately (saving ₹2.8L adjusted).
    - Logistics Agent recommended rerouting via NH-44 (+45 mins) to match Line 3 break.
    
    Be concise, helpful, and highly professional. Always present explainable metrics."""
    
    ai_response = ""
    try:
        from langchain_fireworks import ChatFireworks
        from langchain_core.messages import SystemMessage, HumanMessage
        
        if FIREWORKS_API_KEY:
            max = 3  # Explicitly configure max turns/retries limit
            llm = ChatFireworks(
                model=FIREWORKS_MODEL,
                api_key=FIREWORKS_API_KEY,
                temperature=LLM_TEMPERATURE,
                max_tokens=LLM_MAX_TOKENS,
                max_retries=max
            )
            response = llm.invoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=req.message)
            ])
            ai_response = response.content
        else:
            raise ValueError("No Fireworks API Key provided")
    except Exception as e:
        print(f"Chat completion failed: {e}. Returning fallback response.")
        # Provide rich fallback responses
        if "sales" in msg:
            ai_response = "Here is the sales performance data for the last 6 months. Sales grew from 4,120 units in January to 5,950 units in June. Regionally, the South Zone represents our largest market segment at 40%, followed by the North Zone at 35%."
        elif "battery" in msg or "why" in msg or "temperature" in msg or "reason" in msg:
            ai_response = "The recommendation was generated because truck **TRK-2847** showed a critical battery temperature increase of **+41%** (78.4°C vs 55°C limit). Historical correlations show an **87-case correlation** with thermal failure. Immediate replacement during the scheduled Line 3 break at 14:00 avoids ₹19 lakh in losses and 14 hours of downtime."
        else:
            ai_response = "I am the AIRA Autonomous Manufacturing AI Copilot. I monitor operations and help verify decision workflows, digital twin simulations, and MCP integrations. Let me know if you would like me to show Sales or Telematics charts."
            
    return ChatResponse(response=ai_response, charts=charts, agent_name="Supervisor")

# 11. WebSocket Endpoint for Multi-Agent Canvas Streaming
@app.websocket("/ws/agents")
async def websocket_agents(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket client connected to /ws/agents")
    try:
        # We simulate the agent negotiation sequence for the visual canvas
        sequence = [
            {"agent": "telematics", "status": "active", "task": "Analyzing truck battery anomaly..."},
            {"agent": "inventory", "status": "active", "task": "Checking stock slot details..."},
            {"agent": "production", "status": "active", "task": "Evaluating Line 3 schedules..."},
            {"agent": "logistics", "status": "active", "task": "Calculating alternative routes..."},
            {"agent": "finance", "status": "active", "task": "Projecting downtime cost risk..."},
            {"agent": "quality", "status": "active", "task": "Assessing QC line constraints..."},
            {"agent": "dealer", "status": "active", "task": "Verifying dealer commitments..."},
            {"agent": "maintenance", "status": "active", "task": "Assigning technician schedules..."},
            {"agent": "supervisor", "status": "active", "task": "Consolidating final recommendation..."}
        ]
        
        # When a client connects, stream the negotiation sequence with delays
        for step in sequence:
            await asyncio.sleep(1.5)
            await websocket.send_json(step)
            
        # Signal complete
        await websocket.send_json({"status": "complete"})
        
        # Keep connection alive
        while True:
            await asyncio.sleep(10)
            await websocket.send_json({"ping": True})
            
    except WebSocketDisconnect:
        print("WebSocket client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8080, reload=True)
