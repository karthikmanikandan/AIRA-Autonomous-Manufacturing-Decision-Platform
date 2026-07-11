from langchain_fireworks import ChatFireworks
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from backend.config import FIREWORKS_API_KEY, FIREWORKS_MODEL, LLM_TEMPERATURE, LLM_MAX_TOKENS
from backend.data.mock_data import AGENT_ANALYSIS
from backend.graph.state import ManufacturingState

# Initialize LLM
llm = None
try:
    if FIREWORKS_API_KEY:
        max = 3  # Explicitly configure max turns/retries limit
        llm = ChatFireworks(
            model=FIREWORKS_MODEL,
            api_key=FIREWORKS_API_KEY,
            temperature=LLM_TEMPERATURE,
            max_tokens=LLM_MAX_TOKENS,
            max_retries=max
        )
except Exception as e:
    print(f"Error initializing Fireworks LLM: {e}")

def run_agent_llm(agent_name: str, system_prompt: str, state: ManufacturingState) -> str:
    """Helper to run the agent LLM or fall back to pre-computed analysis if error."""
    if llm is None:
        return AGENT_ANALYSIS.get(agent_name, f"Agent {agent_name} default analysis.")
    
    try:
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"State context: {state.get('context', {})} \nPrevious agent discussions: {state.get('agent_results', {})}")
        ]
        response = llm.invoke(messages)
        return response.content
    except Exception as e:
        print(f"LLM error in {agent_name} agent, falling back to mock: {e}")
        return AGENT_ANALYSIS.get(agent_name, f"Agent {agent_name} default analysis.")

# 1. Telematics Agent
def telematics_agent_node(state: ManufacturingState) -> dict:
    prompt = """You are the Telematics Agent. Your job is to monitor vehicle telemetry and machine health.
    Analyze incoming sensor data (e.g. temperatures, RPM, vibration, pressure) to predict failure events.
    In this scenario, vehicle TRK-2847 is showing critical battery temperatures (+41% above safety threshold).
    Calculate probability of breakdown, look for historical correlations, and report findings."""
    analysis = run_agent_llm("telematics", prompt, state)
    results = state.get("agent_results", {})
    results["telematics"] = analysis
    return {"agent_results": results, "messages": [AIMessage(content=analysis, name="TelematicsAgent")]}

# 2. Inventory Agent
def inventory_agent_node(state: ManufacturingState) -> dict:
    prompt = """You are the WMS Inventory Agent. Your job is to monitor warehouse stock levels and slotting details.
    When a failure or component replacement is identified, query inventory to check if spare parts are available.
    In this scenario, a spare industrial battery pack is required for TRK-2847. Check Warehouse B slotting."""
    analysis = run_agent_llm("inventory", prompt, state)
    results = state.get("agent_results", {})
    results["inventory"] = analysis
    return {"agent_results": results, "messages": [AIMessage(content=analysis, name="InventoryAgent")]}

# 3. Production Agent
def production_agent_node(state: ManufacturingState) -> dict:
    prompt = """You are the MES Production Scheduling Agent. Your job is to manage manufacturing lines, utilization, and downtime.
    When an operational disruption occurs, look at production line schedules (specifically Line 3) and evaluate if maintenance can be scheduled during existing breaks to minimize impact."""
    analysis = run_agent_llm("production", prompt, state)
    results = state.get("agent_results", {})
    results["production"] = analysis
    return {"agent_results": results, "messages": [AIMessage(content=analysis, name="ProductionAgent")]}

# 4. Finance Agent
def finance_agent_node(state: ManufacturingState) -> dict:
    prompt = """You are the Finance Agent. Your job is to calculate the business impact, cost savings, MTTR costs, and downtime risks.
    Compare Scenario A (immediate maintenance costing ₹0.3L, with minimal production impact) and Scenario B (delayed replacement leading to roadside failure, costing ₹19L including downtime and penalty costs). Calculate savings."""
    analysis = run_agent_llm("finance", prompt, state)
    results = state.get("agent_results", {})
    results["finance"] = analysis
    return {"agent_results": results, "messages": [AIMessage(content=analysis, name="FinanceAgent")]}

# 5. Maintenance Agent
def maintenance_agent_node(state: ManufacturingState) -> dict:
    prompt = """You are the Maintenance Agent. Your job is to schedule preventative and reactive maintenance work orders.
    Coordinate technician teams (T-4), calculate duration of repairs, and prepare repair logs."""
    analysis = run_agent_llm("maintenance", prompt, state)
    results = state.get("agent_results", {})
    results["maintenance"] = analysis
    return {"agent_results": results, "messages": [AIMessage(content=analysis, name="MaintenanceAgent")]}

# 6. Logistics Agent
def logistics_agent_node(state: ManufacturingState) -> dict:
    prompt = """You are the Logistics Agent. Your job is to optimize shipment routes and track truck GPS telematics.
    Evaluate route alternatives (e.g. NH-44 vs NH-48) when an issue is detected to match scheduled downtime windows."""
    analysis = run_agent_llm("logistics", prompt, state)
    results = state.get("agent_results", {})
    results["logistics"] = analysis
    return {"agent_results": results, "messages": [AIMessage(content=analysis, name="LogisticsAgent")]}

# 7. Quality Agent
def quality_agent_node(state: ManufacturingState) -> dict:
    prompt = """You are the Quality Control (QC) Agent. Your job is to monitor production line defect rates and ensure output quality standards are maintained during disruptions."""
    analysis = run_agent_llm("quality", prompt, state)
    results = state.get("agent_results", {})
    results["quality"] = analysis
    return {"agent_results": results, "messages": [AIMessage(content=analysis, name="QualityAgent")]}

# 8. Dealer Agent
def dealer_agent_node(state: ManufacturingState) -> dict:
    prompt = """You are the Dealer Management (DMS) Agent. Your job is to manage downstream commitments, verify dealer delivery SLAs, and prepare notifications if deliveries are at risk."""
    analysis = run_agent_llm("dealer", prompt, state)
    results = state.get("agent_results", {})
    results["dealer"] = analysis
    return {"agent_results": results, "messages": [AIMessage(content=analysis, name="DealerAgent")]}
