from sentence_transformers import SentenceTransformer
from app.database import supabase
from typing import Optional

embedder = SentenceTransformer("all-MiniLM-L6-v2")


def embed(text: str) -> list[float]:
    return embedder.encode(text, normalize_embeddings=True).tolist()


def embed_to_string(text: str) -> str:
    vector = embed(text)
    return "[" + ",".join(f"{x:.6f}" for x in vector) + "]"


def search_chunks(
    query: str,
    match_count: int = 5,
    threshold: float = 0.20,
    category: Optional[str] = None,
) -> list[dict]:
    """
    Search knowledge_chunks by semantic similarity.
    Lower threshold = more results but less precise.
    For chat tutor use 0.20, for quiz use 0.25.
    """
    query_embedding_str = embed_to_string(query)

    result = supabase.rpc("match_chunks", {
        "query_embedding": query_embedding_str,
        "match_threshold": threshold,
        "match_count": match_count,
    }).execute()

    docs = result.data or []

    if category:
        docs = [
            d for d in docs
            if (d.get("metadata") or {}).get("category") == category
        ]

    # Sort by similarity score descending if available
    docs.sort(key=lambda d: d.get("similarity", 0), reverse=True)

    return docs


def format_context(docs: list[dict]) -> str:
    """
    Format retrieved chunks into a clean LLM context block.
    Includes source title and content only — no noise.
    """
    if not docs:
        return ""

    parts = []
    for i, doc in enumerate(docs, 1):
        meta = doc.get("metadata") or {}
        title = meta.get("title", f"Reference {i}")
        content = doc.get("content", "").strip()
        source = doc.get("source", "")
        source_line = f"\nSource: {source}" if source else ""
        parts.append(f"[{i}] {title}\n{content}{source_line}")

    return "\n\n".join(parts)


def ingest_chunk(
    content: str,
    source: str = "",
    metadata: dict = None,
) -> dict:
    embedding_str = embed_to_string(content)
    result = supabase.table("knowledge_chunks").insert({
        "content": content,
        "source": source,
        "metadata": metadata or {},
        "embedding": embedding_str,
    }).execute()
    return result.data[0] if result.data else {}


def ingest_roadmap_chunks(roadmap: dict):
    """Chunk roadmap days and store for tutor context retrieval."""
    goal = roadmap.get("goal", "")
    plan = roadmap.get("generated_plan", {})
    weeks = plan.get("weeks", [])

    for week in weeks:
        week_num = week.get("week")
        theme = week.get("theme", "")

        for day in week.get("days", []):
            content = (
                f"Week {week_num}: {theme}\n"
                f"Day {day['day']}: {day['topic']}\n"
                f"{day.get('description', '')}\n"
                f"Estimated time: {day.get('estimated_hours', 1)} hours"
            )
            ingest_chunk(
                content=content,
                source=day.get("resource", ""),
                metadata={
                    "title": f"Week {week_num} Day {day['day']}: {day['topic']}",
                    "category": "roadmap",
                    "week": week_num,
                    "day": day["day"],
                    "goal": goal,
                },
            )