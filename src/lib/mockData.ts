import { SystemHealth, FactoryMetrics, RiskEvent, AIRecommendation } from "./types";

export const systemHealthData: SystemHealth = {
  score: 94.2,
  status: "healthy",
  subsystems: {
    "ERP (Ramco Systems)": 98.0,
    "MES (Production)": 96.0,
    "WMS (Warehouse)": 94.0,
    "DMS (Dealers)": 92.0,
    "IoT Sensors": 97.0,
    "Telematics": 89.0
  },
  last_updated: "Just now"
};

export const factoryMetricsData: FactoryMetrics = {
  oee: 87.3,
  production_rate: 94.2,
  defect_rate: 1.8,
  mtbf: 847,
  energy_per_unit: 12.4,
  on_time_delivery: 96.1,
  trends: {
    oee: [86.1, 86.4, 86.8, 87.1, 87.0, 87.2, 87.3],
    production_rate: [93.5, 93.8, 94.0, 94.1, 93.9, 94.0, 94.2],
    defect_rate: [2.1, 1.95, 1.9, 1.85, 1.82, 1.81, 1.8]
  }
};

export const riskEventsData: RiskEvent[] = [
  {
    event_id: "EVT-2847-BATT",
    event_type: "anomaly_detected",
    source: "Telematics",
    severity: "critical",
    description: "Critical battery temperature anomaly on TRK-2847 carrying critical components for Line 3",
    timestamp: "Just now",
    data: {
      vehicle_id: "TRK-2847",
      component: "Battery Pack B2",
      current_temp: 78.4,
      threshold_temp: 55.0,
      temp_increase_pct: 41,
      location: "Route KA-NH48, KM 127",
      cargo: "Critical engine components for Line 3",
      eta_original: "14:30 IST",
      failure_probability: 0.91,
      historical_correlations: 87
    }
  },
  {
    event_id: "EVT-8742-MOTR",
    event_type: "vibration_warning",
    source: "IoT",
    severity: "warning",
    description: "Micro-vibration warning on Assembly Line 2 main spindle motor",
    timestamp: "30 mins ago",
    data: { vibration_mm_s: 4.8, threshold: 3.5 }
  },
  {
    event_id: "EVT-9012-INVR",
    event_type: "low_stock",
    source: "WMS",
    severity: "info",
    description: "Inventory Alert: Alternator Assembly stock below reorder level in Warehouse A",
    timestamp: "1 hour ago",
    data: { stock: 4, reorder_level: 8 }
  }
];

export const agentNegotiationMessages = [
  {
    agent: "telematics",
    text: "⚠️ Telematics anomaly confirmed. Battery temp spiked to 78.4°C (+41% above safety limit). 91% breakdown probability in 45 mins based on 87 historical failure cases."
  },
  {
    agent: "inventory",
    text: "📦 Inventory checked. Spare battery is available in Warehouse B, Slot R4-C2 (3 units in stock). We have reserved 1 unit for dispatch."
  },
  {
    agent: "production",
    text: "⚙️ MES schedule checked. Assembly Line 3 has a scheduled break at 14:00. Extending it by 30 mins to run battery repair causes only a 2% production drop."
  },
  {
    agent: "logistics",
    text: "🚛 Route optimized. Rerouting TRK-2847 via NH-44 (+45 mins) will avoid heavy traffic and align delivery exactly with the extended break at 14:00."
  },
  {
    agent: "finance",
    text: "💰 Cost analysis. Immediate maintenance dispatch costs ₹0.3L. In contrast, a roadside failure leading to line shutdown costs ₹19L. Net savings: ₹2.8L. ROI: 633%."
  },
  {
    agent: "quality",
    text: "🛡️ Quality check. No ISO compliance or defect rate violations are projected if maintenance is executed within the Line 3 scheduled break window."
  },
  {
    agent: "dealer",
    text: "🏪 DMS check. Three downstream dealer SLAs verified. A 45 min route delay remains within their 2-hour safety buffers. Notifications are prepared."
  },
  {
    agent: "maintenance",
    text: "🔧 Work Order ready. Dispatching Field Team T-4 to meet the vehicle at Route KM 127. Dispatch ETA 35 mins. Repair time: 40 mins."
  },
  {
    agent: "supervisor",
    text: "🎯 Supervisor Recommendation: Reroute TRK-2847 via NH-44, extend Line 3 scheduled break at 14:00, and dispatch T-4. Net savings ₹2.8 lakh. Confidence: 94%."
  }
];

export const mcpExecutionLogs = [
  "[14:02:31] MCP → Connecting to ERP (Ramco Systems)...",
  "[14:02:32] AUTH → JWT token verified ✓ User: plant_manager@aira.enterprise",
  "[14:02:32] RBAC → Access level: WRITE permission validated",
  "[14:02:33] MCP:READ → Fetching PO#2847 from ERP... OK ✓",
  "[14:02:33] MCP:READ → Querying WMS inventory for 'Battery Pack'... OK ✓",
  "[14:02:34] MCP:READ → Loading MES schedule for Assembly Line 3... OK ✓",
  "[14:02:35] RBAC → Write operation requested → Requires manager signature",
  "[14:02:36] APPROVAL → Staging transaction details to human dashboard...",
  "[14:02:37] APPROVAL → ✓ Approved by Plant Manager",
  "[14:02:38] MCP:WRITE → Updating ERP PO#2847 → Status set to EXPEDITED ✓",
  "[14:02:39] MCP:WRITE → Reserving inventory → WMS Slot R4-C2 → LOCKED ✓",
  "[14:02:40] MCP:WRITE → MES Schedule → Assembly Line 3 break extended to 15:30 ✓",
  "[14:02:41] MCP:WRITE → DMS Notification → Staging notifications to 3 affected dealers ✓",
  "[14:02:42] MCP:WRITE → Creating maintenance work order → WO-2847-M ✓",
  "[14:02:43] MCP:WRITE → Logistics → Route updated via NH-44 ✓",
  "[14:02:44] AUDIT → Cryptographic transaction logged → ID: AX-2847-MAINT ✓",
  "[14:02:45] MCP → Session complete. 7 write operations executed successfully."
];

export const aiRecommendationsData: AIRecommendation[] = [
  {
    decision_id: "ACT-2847",
    summary: "Immediate Battery Replacement on TRK-2847",
    recommended_actions: [
      { action: "Reroute truck via NH-44", target_system: "Logistics", priority: "high", estimated_impact: "+45 mins, high safety" },
      { action: "Extend Assembly Line 3 break", target_system: "MES", priority: "high", estimated_impact: "-30 mins production, avoid crash" },
      { action: "Dispatch Field Team T-4", target_system: "Maintenance", priority: "high", estimated_impact: "Repair duration 40 mins" }
    ],
    business_impact: {
      cost_savings: "₹2.8 Lakh",
      downtime_avoided: "12.5 Hours",
      production_impact: "Minimal (2% shift adjust)",
      delivery_impact: "None (within SLA)"
    },
    confidence: 94,
    agents_involved: ["Telematics", "Inventory", "Production", "Finance", "Maintenance", "Logistics", "Quality", "Dealer"],
    evidence: [
      "Battery Temp spiked to 78.4°C (+41%)",
      "Historical runaway correlation points to 87 cases",
      "Spare parts available in Warehouse B, Slot R4-C2"
    ],
    status: "pending"
  }
];

export const telematicsTimeSeriesData = [
  { time: "08:00", battery_temp: 42.1, engine_rpm: 2100, fuel_level: 85, speed: 60, vibration: 1.2 },
  { time: "09:00", battery_temp: 43.5, engine_rpm: 2150, fuel_level: 82, speed: 62, vibration: 1.3 },
  { time: "10:00", battery_temp: 44.8, engine_rpm: 2200, fuel_level: 78, speed: 65, vibration: 1.25 },
  { time: "11:00", battery_temp: 52.3, engine_rpm: 2300, fuel_level: 74, speed: 58, vibration: 2.1 },
  { time: "12:00", battery_temp: 64.9, engine_rpm: 2400, fuel_level: 70, speed: 55, vibration: 2.8 },
  { time: "13:00", battery_temp: 78.4, engine_rpm: 2250, fuel_level: 66, speed: 50, vibration: 3.4 }
];

export const salesData = [
  { month: "Jan", units_sold: 4120, revenue_lakhs: 245 },
  { month: "Feb", units_sold: 4350, revenue_lakhs: 260 },
  { month: "Mar", units_sold: 4890, revenue_lakhs: 295 },
  { month: "Apr", units_sold: 5210, revenue_lakhs: 310 },
  { month: "May", units_sold: 5600, revenue_lakhs: 340 },
  { month: "Jun", units_sold: 5950, revenue_lakhs: 365 }
];

export const salesByRegionData = [
  { name: "North Zone", value: 35 },
  { name: "South Zone", value: 40 },
  { name: "East Zone", value: 15 },
  { name: "West Zone", value: 10 }
];

export const digitalTwinScenarios = {
  scenarios: [
    {
      name: "Scenario A: Immediate Maintenance",
      description: "Reroute truck, extend scheduled Line 3 break by 30 minutes, execute immediate mobile battery replacement",
      metrics: {
        downtime_hours: 1.5,
        production_loss_pct: 2,
        financial_impact_lakhs: 0.3,
        deliveries_delayed: 0,
        confidence: 94
      }
    },
    {
      name: "Scenario B: Delay 6 Hours",
      description: "Defer maintenance until end of shift. High risk of complete thermal failure on road.",
      metrics: {
        downtime_hours: 14,
        production_loss_pct: 18,
        financial_impact_lakhs: 19,
        deliveries_delayed: 12,
        confidence: 87
      }
    }
  ],
  recommendation: "Scenario A: Immediate Maintenance during Scheduled Break",
  comparison_summary: "Scenario A prevents roadside failure, avoids 12.5 hours of unplanned downtime, and saves an estimated ₹18.7 lakh in production losses."
};
export const productionLines = [
  { name: "Line 1", status: "running", utilization: 82, current_product: "Motor Type B", next_maintenance: "15-Jul" },
  { name: "Line 2", status: "running", utilization: 74, current_product: "Alternator Assembly", next_maintenance: "12-Jul" },
  { name: "Line 3", status: "running", utilization: 89, current_product: "Industrial Battery Pack", next_maintenance: "Today 14:00 (Break)" },
  { name: "Line 4", status: "idle", utilization: 0, current_product: "None", next_maintenance: "18-Jul" }
];
