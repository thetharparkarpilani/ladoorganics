-- 018: Editable, published knowledge library for Lado AI.
CREATE TABLE IF NOT EXISTS public.ai_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL DEFAULT 'general',
  title TEXT NOT NULL,
  question_patterns TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ai_knowledge_title_length CHECK (char_length(title) BETWEEN 2 AND 160),
  CONSTRAINT ai_knowledge_answer_length CHECK (char_length(answer) BETWEEN 10 AND 4000),
  CONSTRAINT ai_knowledge_patterns_length CHECK (char_length(question_patterns) BETWEEN 3 AND 1200)
);
CREATE INDEX IF NOT EXISTS ai_knowledge_published_idx ON public.ai_knowledge(is_published, sort_order);
ALTER TABLE public.ai_knowledge ENABLE ROW LEVEL SECURITY;
