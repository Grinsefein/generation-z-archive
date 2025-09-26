# Supabase Setup Guide for SkibidiDB

This guide will help you set up Supabase for the SkibidiDB application to enable contribution functionality.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed on your system

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `skibididb` (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
5. Click "Create new project"
6. Wait for the project to be set up (this may take a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 3: Set Up Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the SQL from `DATABASE_SCHEMA.md` into the SQL editor
3. Click "Run" to execute the SQL and create the necessary tables

### Quick Setup SQL

Here's the essential SQL to get started:

```sql
-- Create terms table
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

-- Create contributions table
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

-- Create categories table
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

-- Enable Row Level Security
ALTER TABLE terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view published terms" ON terms
  FOR SELECT USING (status = 'published');

CREATE POLICY "Anyone can insert contributions" ON contributions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view contributions" ON contributions
  FOR SELECT USING (true);
```

## Step 5: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173/contribute`
3. Try submitting a test contribution
4. Check your Supabase dashboard → **Table Editor** → **contributions** to see if the data was inserted

## Step 6: Set Up Moderation (Required)

**Important**: All user contributions require moderation before being published.

1. Navigate to `http://localhost:5173/moderation`
2. You should see any pending contributions
3. Review each contribution and either:
   - **Approve**: Moves the term to the public database
   - **Reject**: Keeps it in contributions with rejected status
4. Only approved terms will appear in the main application

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables" error**
   - Make sure your `.env` file is in the root directory
   - Check that the variable names start with `VITE_`
   - Restart your development server after adding environment variables

2. **Database connection errors**
   - Verify your Supabase URL and API key are correct
   - Check that your Supabase project is active (not paused)
   - Ensure you've run the database schema SQL

3. **Permission errors**
   - Make sure you've enabled Row Level Security policies
   - Check that the policies allow the operations you're trying to perform

4. **Build errors**
   - Make sure you've installed the Supabase client: `npm install @supabase/supabase-js`
   - Check that all imports are correct

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Visit the [Supabase Discord](https://discord.supabase.com)
- Review the application logs in your browser's developer console

## Next Steps

Once your Supabase setup is working:

1. **Add Authentication**: Set up user accounts for better contribution tracking
2. **Implement Real-time Updates**: Use Supabase's real-time features to show live updates
3. **Add Search**: Implement full-text search using Supabase's search capabilities
4. **Analytics**: Track contribution metrics and user engagement
5. **Moderation Tools**: Build more advanced moderation features

## Security Notes

- Never commit your `.env` file to version control
- Use environment-specific API keys for production
- Regularly review and update your Row Level Security policies
- Consider implementing rate limiting for contributions
