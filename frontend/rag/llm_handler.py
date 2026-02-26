from streaming.state_manager import get_state
from rag.document_store import get_documents
from rag.retriever import retrieve_relevant_docs

def generate_explanation(query: str):
    state = get_state()
    docs = get_documents()

    relevant_docs = retrieve_relevant_docs(query, docs)

    explanation = {
        "location": state["location"],
        "aqi": state["aqi"],
        "stress": state["stress"],
        "alert": state["alert"],
        "news_context": relevant_docs,
        "summary": build_summary(state)
    }

    return explanation


def build_summary(state):
    if state["alert"]:
        return f"Environmental stress is high in {state['location']}. Immediate attention recommended."
    else:
        return f"Environmental conditions in {state['location']} are currently stable."