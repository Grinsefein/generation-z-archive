# Database Schema for SkibidiDB

## Tables

### 1. terms
Stores **published and approved** terms that are visible to users. Terms only appear here after moderator approval.

```sql
CREATE TABLE terms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(10) NOT NULL,
  category VARCHAR(50) NOT NULL,
  definition TEXT NOT NULL,
  origin TEXT,
  examples TEXT[] DEFAULT '{}',
  related_terms TEXT[] DEFAULT '{}',
  popularity_data INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'pending', 'rejected')),
  submitted_by VARCHAR(255),
  view_count INTEGER DEFAULT 0
);

-- Indexes for better performance
CREATE INDEX idx_terms_title ON terms(title);
CREATE INDEX idx_terms_category ON terms(category);
CREATE INDEX idx_terms_status ON terms(status);
CREATE INDEX idx_terms_created_at ON terms(created_at);
```

### 2. contributions
Stores user-submitted terms awaiting moderation. **This is where all new terms go first** - they must be approved before appearing in the public terms table.

```sql
CREATE TABLE contributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  icon VARCHAR(10) NOT NULL,
  category VARCHAR(50) NOT NULL,
  definition TEXT NOT NULL,
  origin TEXT,
  examples TEXT[] DEFAULT '{}',
  related_terms TEXT[] DEFAULT '{}',
  submitted_by VARCHAR(255) NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderator_notes TEXT,
  moderated_by VARCHAR(255),
  moderated_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_contributions_status ON contributions(status);
CREATE INDEX idx_contributions_submitted_at ON contributions(submitted_at);
CREATE INDEX idx_contributions_submitted_by ON contributions(submitted_by);
```

### 3. categories
Predefined categories for terms.

```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, description, icon) VALUES
('Slang', 'Common slang terms and expressions', '🗣️'),
('Meme', 'Internet memes and viral content', '😂'),
('Trend', 'Current trends and popular culture', '📈'),
('Gaming', 'Gaming-related terms and slang', '🎮'),
('Social Media', 'Platform-specific terminology', '📱'),
('Music', 'Music and entertainment slang', '🎵'),
('Fashion', 'Fashion and style terms', '👗'),
('Other', 'Miscellaneous terms', '📝');
```

## Row Level Security (RLS) Policies

### Terms table
```sql
-- Enable RLS
ALTER TABLE terms ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read published terms
CREATE POLICY "Anyone can view published terms" ON terms
  FOR SELECT USING (status = 'published');

-- Allow authenticated users to insert contributions
CREATE POLICY "Authenticated users can contribute" ON terms
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### Contributions table
```sql
-- Enable RLS
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own contributions
CREATE POLICY "Users can submit contributions" ON contributions
  FOR INSERT WITH CHECK (auth.uid()::text = submitted_by);

-- Allow users to view their own contributions
CREATE POLICY "Users can view own contributions" ON contributions
  FOR SELECT USING (auth.uid()::text = submitted_by);

-- Allow moderators to view all contributions
CREATE POLICY "Moderators can view all contributions" ON contributions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'moderator'
    )
  );
```

## Functions

### Update popularity data
```sql
CREATE OR REPLACE FUNCTION update_term_popularity(term_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE terms 
  SET popularity_data = array_append(popularity_data, 
    COALESCE((SELECT COUNT(*) FROM term_views WHERE term_id = term_id), 0)
  )
  WHERE id = term_id;
END;
$$ LANGUAGE plpgsql;
```

### Get related terms
```sql
CREATE OR REPLACE FUNCTION get_related_terms(term_title VARCHAR)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  icon VARCHAR,
  category VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT t.id, t.title, t.icon, t.category
  FROM terms t
  WHERE t.title = ANY(
    SELECT unnest(related_terms) 
    FROM terms 
    WHERE title = term_title
  )
  AND t.status = 'published';
END;
$$ LANGUAGE plpgsql;
```

## Approval Workflow

### How Terms Get Published:

1. **User Submits** → Term goes to `contributions` table with `status: 'pending'`
2. **Moderator Reviews** → Moderator can approve or reject in `/moderation` page
3. **If Approved** → Term is moved to `terms` table with `status: 'published'`
4. **If Rejected** → Term stays in `contributions` with `status: 'rejected'`

### Important Notes:

- **No direct publishing**: Users cannot directly add terms to the public `terms` table
- **Moderation required**: All terms must go through the approval process
- **Status tracking**: Each contribution has a clear status (pending/approved/rejected)
- **Audit trail**: All contributions are kept for review and analytics

## Setup Instructions

1. Create a new Supabase project
2. Run the SQL commands above in the Supabase SQL editor
3. Set up authentication (optional for basic functionality)
4. Configure your environment variables in `.env` file
5. Test the connection with the provided client code
6. **Set up moderation**: Access `/moderation` to review and approve contributions
