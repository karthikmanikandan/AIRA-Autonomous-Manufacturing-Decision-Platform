from datetime import datetime
from backend.data.data_loader import calculate_live_metrics, get_live_telematics

# System Health State
SYSTEM_HEALTH = {
    "score": 94.2,
    "status": "healthy",
    "subsystems": {
        "ERP (Ramco Systems)": 98.0,
        "MES (Production)": 96.0,
        "WMS (Warehouse)": 94.0,
        "DMS (Dealers)": 92.0,
        "IoT Sensors": 97.0,
        "Telematics": 89.0
    },
    "last_updated": "Just now"
}

# Live Factory metrics (calculated from datasets)
def get_live_metrics():
    return calculate_live_metrics()

# Live telematics time series
def get_live_telematics_data():
    return get_live_telematics()

# Monthly Sales Data for Copilot Bar/Pie Charts
SALES_DATA = [
    {"month": "Jan", "units_sold": 4120, "revenue_lakhs": 245.0},
    {"month": "Feb", "units_sold": 4350, "revenue_lakhs": 260.0},
    {"month": "Mar", "units_sold": 4890, "revenue_lakhs": 295.0},
    {"month": "Apr", "units_sold": 5210, "revenue_lakhs": 310.0},
    {"month": "May", "units_sold": 5600, "revenue_lakhs": 340.0},
    {"month": "Jun", "units_sold": 5950, "revenue_lakhs": 365.0}
]

SALES_BY_REGION = [
    {"name": "North Zone", "value": 35},
    {"name": "South Zone", "value": 40},
    {"name": "East Zone", "value": 15},
    {"name": "West Zone", "value": 10}
]

# Inventory data
INVENTORY_DATA = {
    "Warehouse A": [
        {"item": "Engine Cylinder Block", "quantity": 14, "reorder_level": 5},
        {"item": "Alternator Assembly", "quantity": 22, "reorder_level": 8}
    ],
    "Warehouse B": [
        {"item": "Battery Pack - Industrial Grade", "quantity": 3, "slot": "R4-C2", "reorder_level": 2},
        {"item": "Starter Motor 24V", "quantity": 8, "reorder_level": 3}
    ]
}

# Production lines status
PRODUCTION_LINES = [
    {"name": "Assembly Line 1", "status": "running", "utilization": 82.5, "current_product": "Engine Type A", "next_maintenance": "2026-07-15"},
    {"name": "Assembly Line 2", "status": "running", "utilization": 74.0, "current_product": "Engine Type B", "next_maintenance": "2026-07-12"},
    {"name": "Assembly Line 3", "status": "running", "utilization": 89.0, "current_product": "Gearbox G-30", "next_maintenance": "Today 14:00 (Break)"},
    {"name": "Assembly Line 4", "status": "idle", "utilization": 0.0, "current_product": "None", "next_maintenance": "2026-07-18"}
]

# Affected Dealers
DEALER_DATA = [
    {"id": "D-104", "name": "Apex Motors (Bangalore)", "order": "15x Engine Type A", "sla_hours": 4},
    {"id": "D-107", "name": "Precision Auto (Chennai)", "order": "8x Gearbox G-30", "sla_hours": 6},
    {"id": "D-112", "name": "Maruti Distributors (Mumbai)", "order": "12x Engine Type B", "sla_hours": 8}
]

# Risk event stream
RISK_EVENTS = [
    {
        "event_id": "EVT-2847-BATT",
        "event_type": "anomaly_detected",
        "source": "Telematics",
        "severity": "critical",
        "description": "Critical battery temperature anomaly on TRK-2847 carrying critical components for Line 3",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "data": {
            "vehicle_id": "TRK-2847",
            "component": "Battery Pack B2",
            "current_temp": 78.4,
            "threshold_temp": 55.0,
            "temp_increase_pct": 41,
            "location": "Route KA-NH48, KM 127",
            "cargo": "Critical engine components for Line 3",
            "eta_original": "14:30 IST",
            "failure_probability": 0.91,
            "historical_correlations": 87
        }
    },
    {
        "event_id": "EVT-8742-MOTR",
        "event_type": "vibration_warning",
        "source": "IoT Sensors",
        "severity": "warning",
        "description": "Micro-vibration warning on Assembly Line 2 main spindle motor",
        "timestamp": "30 mins ago",
        "data": {"vibration_mm_s": 4.8, "threshold": 3.5}
    },
    {
        "event_id": "EVT-9012-INVR",
        "event_type": "low_stock",
        "source": "WMS",
        "severity": "info",
        "description": "Inventory Alert: Alternator Assembly stock below reorder level in Warehouse A",
        "timestamp": "1 hour ago",
        "data": {"stock": 4, "reorder_level": 8}
    }
]

# Pre-computed Agent analysis for demo
AGENT_ANALYSIS = {
    "telematics": "CRITICAL: Vehicle TRK-2847 telematics indicates battery temperature spiked to 78.4°C (+41% above threshold). Historical failure correlation points to an 87-case correlation of thermal runaway within 45 minutes, with a 91% disruption probability. Action required immediately to avoid roadside stranding.",
    "inventory": "AVAILABILITY CHECK: Spare industrial-grade battery pack is available in Warehouse B, Slot R4-C2 (3 units in stock). We have reserved 1 unit for dispatch. Dispatch time: 10 mins.",
    "production": "SCHEDULE ANALYSIS: Assembly Line 3 is scheduled for a production break at 14:00-15:30 IST. Extending this break by 30 mins to perform maintenance will result in only a 2% production adjustment. Estimated downtime impact is minimal compared to unplanned breakdown.",
    "logistics": "ROUTE PLANNING: Rerouting TRK-2847 via NH-44 instead of the congested NH-48. This adds +45 minutes to transit, but provides safe passage and ensures delivery coincides perfectly with the extended Line 3 scheduled break.",
    "finance": "FINANCIAL IMPACT: Cost of immediate mobile maintenance dispatch is ₹0.3L. In contrast, a roadside battery failure leading to shutdown of Line 3 causes 14 hours of total downtime, 18% production loss, and contractual dealer penalties, totaling ₹19L. Net savings: ₹2.8L (adjusted for operations). ROI: 633%.",
    "quality": "QUALITY ASSURANCE: No impact on product quality metrics is projected. Line 3 temperature/humidity parameters remain within nominal thresholds. Rescheduling will not violate ISO/TS compliance.",
    "dealer": "DEALER COMMITMENTS: Three dealers (D-104, D-107, D-112) have critical orders depending on Line 3 output. Rerouting keeps us within their 2-hour SLA buffer. Notifications prepared and staged for dispatch.",
    "maintenance": "MAINTENANCE SCHEDULING: Field technician team T-4 is fully equipped with tools and in transit. ETA to KM 127 is 35 minutes. Repair duration: 40 minutes.",
    "supervisor": "SUPERVISOR AGENT: Consolidating agent reports. The Telematics anomaly carries 91% risk. Recommended: Execute immediate battery replacement during the scheduled Line 3 break at 14:00. Reroute shipment via NH-44. Dispatch Field Team T-4. Net savings ₹2.8L. Confidence score: 94%."
}

# Digital Twin Comparison
DIGITAL_TWIN_SCENARIOS = {
    "scenarios": [
        {
            "name": "Scenario A: Immediate Maintenance",
            "description": "Reroute truck, extend scheduled Line 3 break by 30 minutes, execute immediate mobile battery replacement",
            "metrics": {
                "downtime_hours": 1.5,
                "production_loss_pct": 2.0,
                "financial_impact_lakhs": 0.3,
                "deliveries_delayed": 0,
                "confidence": 94.0
            }
        },
        {
            "name": "Scenario B: Delay 6 Hours",
            "description": "Defer maintenance until end of shift. High risk of complete thermal failure on road.",
            "metrics": {
                "downtime_hours": 14.0,
                "production_loss_pct": 18.0,
                "financial_impact_lakhs": 19.0,
                "deliveries_delayed": 12,
                "confidence": 87.0
            }
        }
    ],
    "recommendation": "Scenario A: Immediate Maintenance during Scheduled Break",
    "comparison_summary": "Scenario A prevents roadside failure, avoids 12.5 hours of unplanned downtime, and saves an estimated ₹18.7 lakh in production losses."
}

# MCP Execution terminal log output
MCP_EXECUTION_LOG = [
    "[14:02:31] MCP → Connecting to ERP (Ramco Systems)...",
    "[14:02:32] AUTH → JWT token verified ✓ User: plant_manager@aira.enterprise",
    "[14:02:32] RBAC → Access level: WRITE permission validated",
    "[14:02:33] MCP:READ → Fetching PO#2847 from ERP... OK ✓",
    "[14:02:33] MCP:READ → Querying WMS inventory for 'Battery Pack - Industrial Grade'... OK ✓",
    "[14:02:34] MCP:READ → Loading MES schedule for Assembly Line 3... OK ✓",
    "[14:02:35] RBAC → Write operation requested → Requires plant manager signature",
    "[14:02:36] APPROVAL → Staging transaction details to human dashboard...",
    "[14:02:37] APPROVAL → ✓ Approved by Plant Manager",
    "[14:02:38] MCP:WRITE → Updating ERP PO#2847 → Status set to EXPEDITED ✓",
    "[14:02:39] MCP:WRITE → Reserving inventory → WMS Slot R4-C2 → LOCKED ✓",
    "[14:02:40] MCP:WRITE → MES Schedule → Assembly Line 3 break extended to 15:30 ✓",
    "[14:02:41] MCP:WRITE → DMS Notification → Staging notifications to 3 affected dealers ✓",
    "[14:02:42] MCP:WRITE → Creating maintenance work order → WO-2847-M ✓",
    "[14:02:43] MCP:WRITE → Logistics → Route updated via NH-44 ✓",
    "[14:02:44] AUDIT → Writing cryptographic hash to blockchain ledger... OK ✓",
    "[14:02:44] AUDIT → Transaction logged → ID: AX-2847-MAINT ✓",
    "[14:02:45] MCP → Session complete. 7 write operations executed successfully."
]

# Recommendations list
AI_RECOMMENDATIONS = [
    {
        "decision_id": "REC-2847",
        "summary": "Immediate Battery Replacement on TRK-2847",
        "recommended_actions": [
            {"action": "Reroute truck via NH-44", "target_system": "Logistics", "priority": "high", "estimated_impact": "+45 mins, high safety"},
            {"action": "Extend Assembly Line 3 break", "target_system": "MES", "priority": "high", "estimated_impact": "-30 mins production, avoid crash"},
            {"action": "Dispatch Field Team T-4", "target_system": "Maintenance", "priority": "high", "estimated_impact": "Repair duration 40 mins"}
        ],
        "business_impact": {
            "cost_savings": "₹2.8 Lakh",
            "downtime_avoided": "12.5 Hours",
            "production_impact": "Minimal (2% shift adjust)",
            "delivery_impact": "None (within SLA)"
        },
        "confidence": 94.0,
        "agents_involved": ["Telematics", "Inventory", "Production", "Finance", "Maintenance", "Logistics", "Quality", "Dealer"],
        "evidence": [
            "Battery Temp spiked to 78.4°C (+41%)",
            "Historical runaway correlation points to 87 cases",
            "Spare parts available in Warehouse B, Slot R4-C2"
        ],
        "status": "pending"
    },
    {
        "decision_id": "REC-8742",
        "summary": "Assembly Line 2 Spindle Motor Maintenance",
        "recommended_actions": [
            {"action": "Schedule vibration inspection", "target_system": "MES", "priority": "medium", "estimated_impact": "1h scheduled down"},
            {"action": "Inspect coupling grease", "target_system": "Maintenance", "priority": "medium", "estimated_impact": "30 mins"}
        ],
        "business_impact": {
            "cost_savings": "₹0.6 Lakh",
            "downtime_avoided": "4 Hours",
            "production_impact": "Scheduled",
            "delivery_impact": "None"
        },
        "confidence": 78.0,
        "agents_involved": ["IoT Sensors", "Maintenance", "Finance"],
        "evidence": [
            "Motor spindle vibration at 4.8 mm/s (limit 3.5)",
            "Last motor lubrication was 3 months ago"
        ],
        "status": "pending"
    }
]
