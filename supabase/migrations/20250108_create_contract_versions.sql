
-- Create contract_versions table
CREATE TABLE IF NOT EXISTS contract_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  version_number TEXT NOT NULL,
  content TEXT, -- Content of this specific version
  analysis JSONB, -- Analysis result for this version
  changes_summary TEXT, -- Description of changes from previous version
  status TEXT DEFAULT 'active', -- active, archived, draft
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contract_versions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view versions of their contracts" 
ON contract_versions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM contracts 
    WHERE contracts.id = contract_versions.contract_id 
    AND contracts.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert versions for their contracts" 
ON contract_versions FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM contracts 
    WHERE contracts.id = contract_versions.contract_id 
    AND contracts.user_id = auth.uid()
  )
);

-- Add versioning columns to contracts table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contracts' AND column_name = 'current_version') THEN
        ALTER TABLE contracts ADD COLUMN current_version TEXT DEFAULT '1.0';
    END IF;
END $$;
