from typing import TypedDict, Annotated, Dict, Any, List
from langgraph.graph.message import add_messages

class ManufacturingState(TypedDict):
    messages: Annotated[List[Any], add_messages]
    next_agent: str
    agent_results: Dict[str, str]
    decision: Dict[str, Any]
    context: Dict[str, Any]
    iteration_count: int
