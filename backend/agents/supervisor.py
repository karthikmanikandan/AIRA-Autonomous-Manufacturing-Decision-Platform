from pydantic import BaseModel, Field
from typing import Literal, Any
from langchain_fireworks import ChatFireworks
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from backend.config import FIREWORKS_API_KEY, FIREWORKS_MODEL, LLM_TEMPERATURE, LLM_MAX_TOKENS, MAX_AGENT_ITERATIONS
from backend.graph.state import ManufacturingState

class SupervisorDecision(BaseModel):
    next: Literal["telematics", "inventory", "production", "finance", "maintenance", "logistics", "quality", "dealer", "FINISH"] = Field(
        description="The next specialized agent to call, or FINISH if all information has been gathered."
    )
    reasoning: str = Field(description="Detailed explanation for routing choice.")

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
    print(f"Error initializing Fireworks LLM in supervisor: {e}")

def supervisor_node(state: ManufacturingState) -> dict:
    iteration_count = state.get("iteration_count", 0) + 1
    
    # Enforce loop limits
    if iteration_count > MAX_AGENT_ITERATIONS:
        print(f"Reached max iterations limit ({MAX_AGENT_ITERATIONS}). Ending graph.")
        return {"next_agent": "FINISH", "iteration_count": iteration_count}
    
    system_prompt = f"""You are the Supervisor Agent for AIRA (Autonomous Manufacturing Decision Platform).
    Your job is to orchestrate a team of specialized agents to solve manufacturing anomalies.
    
    Available specialized agents:
    - telematics: Analyzes machine/vehicle sensor logs and anomalies
    - inventory: Checks spare parts availability and slot details
    - production: Evaluates factory line scheduling and downtime
    - finance: Computes financial risks, ROI, and costs
    - maintenance: Coordinates technicians and repair logistics
    - logistics: Optimizes shipping routes and location tracking
    - quality: Monitors factory line defect rates and standards
    - dealer: Coordinates downstream delivery commitments
    
    Orchestration guidelines:
    1. Call agents sequentially to gather all required domain info.
    2. Once all relevant agents have processed the anomaly and reached consensus, select FINISH.
    
    Current iteration: {iteration_count}/{MAX_AGENT_ITERATIONS}
    Already processed agents: {list(state.get('agent_results', {}).keys())}
    """
    
    next_agent = "FINISH"
    reasoning = "All agents consulted. Concurring on immediate battery replacement."
    
    if llm is not None:
        try:
            structured_llm = llm.with_structured_output(SupervisorDecision)
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=f"Conversation messages: {state['messages']}")
            ]
            response = structured_llm.invoke(messages)
            next_agent = response.next
            reasoning = response.reasoning
        except Exception as e:
            print(f"Error calling supervisor LLM: {e}. Using deterministic fallback.")
            # Deterministic fallback based on who has spoken
            spoken = list(state.get('agent_results', {}).keys())
            sequence = ["telematics", "inventory", "production", "logistics", "finance", "maintenance", "quality", "dealer"]
            next_agent = "FINISH"
            for agent in sequence:
                if agent not in spoken:
                    next_agent = agent
                    reasoning = f"Determined fallback: Consulting the {agent} agent next."
                    break
    else:
        # Fallback sequence when offline
        spoken = list(state.get('agent_results', {}).keys())
        sequence = ["telematics", "inventory", "production", "logistics", "finance", "maintenance", "quality", "dealer"]
        next_agent = "FINISH"
        for agent in sequence:
            if agent not in spoken:
                next_agent = agent
                reasoning = f"Offline fallback sequence: Consulting the {agent} agent."
                break

    print(f"Supervisor decided: next={next_agent}, reasoning={reasoning}")
    return {
        "next_agent": next_agent,
        "iteration_count": iteration_count,
        "messages": [AIMessage(content=reasoning, name="SupervisorAgent")]
    }

def route_supervisor(state: ManufacturingState) -> str:
    """Routing function for conditional edges."""
    return state.get("next_agent", "FINISH")
