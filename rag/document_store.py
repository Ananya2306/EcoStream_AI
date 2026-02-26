from streaming.state_manager import get_state

def get_documents():
    """
    Returns latest news documents from streaming state.
    """
    state = get_state()
    return state.get("news", [])