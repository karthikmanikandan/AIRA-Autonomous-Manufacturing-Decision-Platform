from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

from backend.graph.state import ManufacturingState
from backend.agents.supervisor import supervisor_node, route_supervisor
from backend.agents.specialists import (
    telematics_agent_node,
    inventory_agent_node,
    production_agent_node,
    finance_agent_node,
    maintenance_agent_node,
    logistics_agent_node,
    quality_agent_node,
    dealer_agent_node
)

def build_graph():
    # Initialize the StateGraph
    builder = StateGraph(ManufacturingState)
    
    # Add nodes
    builder.add_node("supervisor", supervisor_node)
    builder.add_node("telematics", telematics_agent_node)
    builder.add_node("inventory", inventory_agent_node)
    builder.add_node("production", production_agent_node)
    builder.add_node("finance", finance_agent_node)
    builder.add_node("maintenance", maintenance_agent_node)
    builder.add_node("logistics", logistics_agent_node)
    builder.add_node("quality", quality_agent_node)
    builder.add_node("dealer", dealer_agent_node)
    
    # Define routing edges from supervisor
    builder.add_conditional_edges(
        "supervisor",
        route_supervisor,
        {
            "telematics": "telematics",
            "inventory": "inventory",
            "production": "production",
            "finance": "finance",
            "maintenance": "maintenance",
            "logistics": "logistics",
            "quality": "quality",
            "dealer": "dealer",
            "FINISH": END
        }
    )
    
    # Define return edges back to supervisor
    builder.add_edge("telematics", "supervisor")
    builder.add_edge("inventory", "supervisor")
    builder.add_edge("production", "supervisor")
    builder.add_edge("finance", "supervisor")
    builder.add_edge("maintenance", "supervisor")
    builder.add_edge("logistics", "supervisor")
    builder.add_edge("quality", "supervisor")
    builder.add_edge("dealer", "supervisor")
    
    # Set entry point
    builder.add_edge(START, "supervisor")
    
    # Compile with memory persistence
    memory = MemorySaver()
    return builder.compile(checkpointer=memory)

# Export the compiled workflow
graph = build_graph()

def create_initial_state(event_data: dict) -> dict:
    """Helper to structure the initial state."""
    return {
        "messages": [],
        "next_agent": "supervisor",
        "agent_results": {},
        "decision": {},
        "context": event_data,
        "iteration_count": 0
    }
