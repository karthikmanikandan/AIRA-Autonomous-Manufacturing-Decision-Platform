from backend.data.mock_data import DIGITAL_TWIN_SCENARIOS

def simulate_scenarios(event_data: dict, proposed_action: str = "") -> dict:
    """Simulates business metrics comparing immediate action vs deferral using Digital Twin models."""
    print(f"Digital Twin simulating scenarios for: {proposed_action}...")
    
    # We return the high fidelity scenarios from mock data
    return DIGITAL_TWIN_SCENARIOS
