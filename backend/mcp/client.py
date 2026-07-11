from typing import Dict, Any, List
from backend.data.mock_data import MCP_EXECUTION_LOG
from backend.mcp.server import write_erp_po, write_mes_schedule

# Staged MCP approval queue
approval_queue: Dict[str, Dict[str, Any]] = {
    "ACT-2847": {
        "action_id": "ACT-2847",
        "action_type": "mcp_write_workflow",
        "target_system": "Ramco ERP & WMS",
        "description": "Execute battery replacement. Update ERP PO#2847 to EXPEDITED, reserve slot R4-C2, extend Line 3 Scheduled break.",
        "payload": {
            "po_id": "PO#2847",
            "line_id": "Line 3",
            "break_end": "15:30"
        },
        "status": "pending",
        "requires_approval": True,
        "audit_log": [
            "Staged execution payload at 14:02:30",
            "RBAC rules validated, Human-in-the-Loop approval requested"
        ]
    }
}

class AIRAMCPClient:
    """Standard Model Context Protocol client implementation to interface with MCP Server tools."""
    
    def __init__(self):
        self.active_session = True
        
    def get_approval_queue(self) -> List[Dict[str, Any]]:
        return list(approval_queue.values())
        
    def approve_action(self, action_id: str, approver: str = "plant_manager") -> Dict[str, Any]:
        """Approve and execute a staged MCP tool action."""
        if action_id not in approval_queue:
            return {"status": "error", "message": "Action ID not found."}
            
        action = approval_queue[action_id]
        
        if action["status"] == "executed":
            return action
            
        # Transition state
        action["status"] = "executed"
        action["audit_log"].append(f"Approved by {approver} at 14:02:37")
        
        # Execute actual MCP Server Tools under the hood
        payload = action["payload"]
        try:
            r1 = write_erp_po(payload["po_id"], {"status": "EXPEDITED", "priority": "HIGH"})
            r2 = write_mes_schedule(payload["line_id"], payload["break_end"])
            action["audit_log"].append(r1)
            action["audit_log"].append(r2)
            action["audit_log"].append("All MCP write transactions executed successfully.")
        except Exception as e:
            action["audit_log"].append(f"MCP Write Error: {e}")
            
        return action

    def reject_action(self, action_id: str, approver: str = "plant_manager") -> Dict[str, Any]:
        if action_id not in approval_queue:
            return {"status": "error", "message": "Action ID not found."}
            
        action = approval_queue[action_id]
        action["status"] = "rejected"
        action["audit_log"].append(f"Rejected by {approver} at 14:02:37")
        return action
        
    def get_execution_log(self) -> List[str]:
        return MCP_EXECUTION_LOG

# Instantiate singleton client
mcp_client = AIRAMCPClient()
