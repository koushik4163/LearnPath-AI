-- Enable pgvector extension
create extension if not exists vector;

-- Knowledge chunks table for RAG
create table if not exists knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  source text default '',
  metadata jsonb default '{}',
  embedding vector(384),
  created_at timestamptz default now()
);

-- Index for fast cosine similarity search
create index if not exists knowledge_chunks_embedding_idx
on knowledge_chunks
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- Match function used by rag_service.py
create or replace function match_chunks (
  query_embedding vector(384),
  match_threshold float default 0.3,
  match_count int default 5
)
returns table (
  id uuid,
  content text,
  source text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    id,
    content,
    source,
    metadata,
    1 - (embedding <=> query_embedding) as similarity
  from knowledge_chunks
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;