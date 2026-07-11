export const API_BASE_URL = typeof window !== 'undefined' 
  ? '/api/backend' 
  : (process.env.BACKEND_URL || 'http://localhost:8000');

export const AGENT_LIST = [
  {
    name: "telematics",
    label: "Telematics Agent",
    icon: "Activity",
    color: "#EF4444", // red
    description: "Monitors vehicle GPS telemetry, machine vibration, and thermal sensors in real-time."
  },
  {
    name: "inventory",
    label: "Inventory Agent",
    icon: "Box",
    color: "#06B6D4", // cyan
    description: "Tracks warehouse WMS slot details, parts availability, and reorder alerts."
  },
  {
    name: "production",
    label: "Production Agent",
    icon: "Cpu",
    color: "#8B5CF6", // purple
    description: "Evaluates MES shift lines schedules, OEE utilization, and maintenance windows."
  },
  {
    name: "logistics",
    label: "Logistics Agent",
    icon: "Truck",
    color: "#F59E0B", // amber
    description: "Reroutes supply shipments, calculates original ETA buffers, and minimizes transit delay."
  },
  {
    name: "finance",
    label: "Finance Agent",
    icon: "DollarSign",
    color: "#10B981", // emerald
    description: "Calculates cost impact, maintenance expenses, and projects ROI savings."
  },
  {
    name: "maintenance",
    label: "Maintenance Agent",
    icon: "Settings",
    color: "#06B6D4",
    description: "Coordinates technician teams and dispatch work orders."
  },
  {
    name: "quality",
    label: "Quality Agent",
    icon: "ShieldAlert",
    color: "#3B82F6", // blue
    description: "Ensures defect rates stay within standard ISO validation protocols."
  },
  {
    name: "dealer",
    label: "Dealer Agent",
    icon: "Users",
    color: "#F43F5E", // rose
    description: "Manages downstream commitments and critical dealer delivery SLA logs."
  },
  {
    name: "supervisor",
    label: "Supervisor Agent",
    icon: "Award",
    color: "#EC4899", // pink
    description: "Coordinates specialized agent pipelines and negotiates final operational decisions."
  }
];

export const DEMO_PHASES = [
  { step: 0, title: "System Normal", description: "Factory operating normally at 94% health." },
  { step: 1, title: "Anomaly Detected", description: "TRK-2847 battery temperature exceeds safety limits." },
  { step: 2, title: "Agent Negotiation", description: "Specialized AI agents collaborate to resolve risk." },
  { step: 3, title: "Recommendation Formed", description: "Supervisor proposes unified dispatch plan." },
  { step: 4, title: "Awaiting Action", description: "Staged MCP transaction waiting for manager signature." },
  { step: 5, title: "MCP Execution", description: "Executing authenticated database writes in real-time." },
  { step: 6, title: "System Recovered", description: "Downtime avoided. Factory returned to stable operation." }
];
