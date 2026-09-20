/*
# Create entries table for Silent Symptom tracker

1. New Tables
- `entries`
  - `id` (uuid, primary key, auto-generated)
  - `user_id` (uuid, not null, defaults to the authenticated user, references auth.users with cascade delete)
  - `raw_text` (text, not null — the user's free-form symptom log)
  - `tags` (text[], default empty array — AI-extracted symptom keywords)
  - `severity` (int, 1-5, default 3 — AI-assigned severity)
  - `body_area` (text, nullable — AI-extracted body area)
  - `flagged` (boolean, default false — user can star/flag important entries)
  - `created_at` (timestamptz, default now)
2. Security
- Enable RLS on `entries`.
- Owner-scoped CRUD: each authenticated user can only access rows they own (4 separate policies for SELECT, INSERT, UPDATE, DELETE).
3. Indexes
- Index on `user_id` for fast per-user queries.
- Index on `created_at` descending for timeline ordering.
4. Important Notes
- `user_id` defaults to `auth.uid()` so frontend inserts that omit `user_id` still pass the INSERT WITH CHECK.
- Tags stored as a Postgres text array for efficient filtering.
*/

CREATE TABLE IF NOT EXISTS entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  raw_text text NOT NULL,
  tags text[] DEFAULT '{}',
  severity int NOT NULL DEFAULT 3 CHECK (severity >= 1 AND severity <= 5),
  body_area text,
  flagged boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_entries_user_id ON entries(user_id);
CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(created_at DESC);

DROP POLICY IF EXISTS "select_own_entries" ON entries;
CREATE POLICY "select_own_entries" ON entries FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_entries" ON entries;
CREATE POLICY "insert_own_entries" ON entries FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_entries" ON entries;
CREATE POLICY "update_own_entries" ON entries FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_entries" ON entries;
CREATE POLICY "delete_own_entries" ON entries FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
