def retrieve_relevant_docs(query, documents):
    """
    Basic keyword-based retrieval.
    """
    query = query.lower()
    relevant = []

    for doc in documents:
        if any(word in doc["title"].lower() for word in query.split()):
            relevant.append(doc)

    return relevant[:3]