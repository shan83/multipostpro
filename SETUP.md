# Setup Guide

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Go to Settings > API to get your project URL and anon key
3. Run the migration in `supabase/migrations/20250523060237_navy_fog.sql` in your Supabase SQL editor
4. Configure authentication settings in your Supabase dashboard:
   - Go to Authentication > Settings
   - Enable email confirmations if desired
   - Configure any additional auth providers

## Running the Application

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open http://localhost:5173 in your browser

## Troubleshooting Sign Up Issues

If sign up is not working:

1. Check that your environment variables are set correctly
2. Verify that the database migration has been run
3. Check the browser console for any error messages
4. Ensure your Supabase project has authentication enabled
5. Check that the RLS policies are properly configured 