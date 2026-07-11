from typing import Dict, Any, List
import sys

# Try to import FastMCP, if not available use a mock fallback class
try:
    from fastmcp import FastMCP
    mcp_server = FastMCP("AIRA Enterprise Systems")
except ImportError:
    print("fastmcp not installed. Using fallback MCP Server implementation.", file=sys.stderr)
    class FastMCPMock:
        def __init__(self, name: str):
            self.name = name
            self.tools = {}
        def tool(self):
            def decorator(func):
                self.tools[func.__name__] = func
                return func
            return decorator
    mcp_server = FastMCPMock("AIRA Enterprise Systems")

# Pre-defined mock states representing enterprise databases
_ERP_PO_DB = {
    "PO#2847": {"item": "Battery Pack - Industrial Grade", "qty": 1, "status": "PENDING", "priority": "NORMAL"}
}
_WMS_INV_DB = {
    "Warehouse B": {"slot": "R4-C2", "item": "Battery Pack - Industrial Grade", "stock": 3}
}
_MES_SCHED_DB = {
    "Line 3": {"break_start": "14:00", "break_end": "15:00", "status": "running"}
}

# --- MCP Tools ---

@mcp_server.tool()
def read_erp_po(po_id: str) -> str:
    """Read purchase order details from Ramco ERP system."""
    po = _ERP_PO_DB.get(po_id)
    if po:
        return f"Ramco ERP - PO ID: {po_id} | Item: {po['item']} | Quantity: {po['qty']} | Status: {po['status']} | Priority: {po['priority']}"
    return f"Purchase Order {po_id} not found in ERP."

@mcp_server.tool()
def read_wms_inventory(warehouse: str, item_name: str) -> str:
    """Read stock level and slot location from Warehouse Management System (WMS)."""
    wh = _WMS_INV_DB.get(warehouse)
    if wh and wh["item"] == item_name:
        return f"WMS - Warehouse: {warehouse} | Item: {item_name} | Stock: {wh['stock']} | Slot Location: {wh['slot']}"
    return f"Item '{item_name}' not found in {warehouse}."

@mcp_server.tool()
def read_mes_schedule(line_id: str) -> str:
    """Read schedule details and maintenance breaks from Manufacturing Execution System (MES)."""
    sched = _MES_SCHED_DB.get(line_id)
    if sched:
        return f"MES - Line ID: {line_id} | Status: {sched['status']} | Scheduled Break: {sched['break_start']}-{sched['break_end']}"
    return f"Line ID '{line_id}' not found in MES."

@mcp_server.tool()
def write_erp_po(po_id: str, updates: dict) -> str:
    """Write updates to an ERP purchase order (Gated by RBAC)."""
    po = _ERP_PO_DB.get(po_id)
    if po:
        po.update(updates)
        return f"SUCCESS: ERP PO {po_id} updated. Current State: {po}"
    return f"ERROR: PO {po_id} not found."

@mcp_server.tool()
def write_mes_schedule(line_id: str, break_end: str) -> str:
    """Write modifications to MES line schedules (Gated by RBAC)."""
    sched = _MES_SCHED_DB.get(line_id)
    if sched:
        sched["break_end"] = break_end
        return f"SUCCESS: MES Line {line_id} break extended until {break_end}."
    return f"ERROR: Line {line_id} not found."

def get_mcp_tools_list() -> List[Dict[str, Any]]:
    """Exposes tool metadata for LLM function binding."""
    return [
        {
            "name": "read_erp_po",
            "description": "Read purchase order details from Ramco ERP system.",
            "parameters": {
                "type": "object",
                "properties": {
                    "po_id": {"type": "string", "description": "Purchase order ID, e.g. PO#2847"}
                },
                "required": ["po_id"]
            }
        },
        {
            "name": "read_wms_inventory",
            "description": "Read stock level and slot location from Warehouse Management System (WMS).",
            "parameters": {
                "type": "object",
                "properties": {
                    "warehouse": {"type": "string", "description": "Warehouse name, e.g. Warehouse B"},
                    "item_name": {"type": "string", "description": "Item name to query"}
                },
                "required": ["warehouse", "item_name"]
            }
        },
        {
            "name": "read_mes_schedule",
            "description": "Read schedule details and maintenance breaks from Manufacturing Execution System (MES).",
            "parameters": {
                "type": "object",
                "properties": {
                    "line_id": {"type": "string", "description": "Line ID, e.g. Line 3"}
                },
                "required": ["line_id"]
            }
        }
    ]
