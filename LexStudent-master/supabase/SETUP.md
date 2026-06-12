# Supabase Setup Guide for LexStudent

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Click **New Project**
   - Name: `lexstudent`
   - Region: Pick closest to your users (e.g., West EU, or any region)
   - Set a strong database password (save it somewhere!)
3. Wait for the project to be created (~2 minutes)

## 2. Get Your Keys

Go to **Settings → API** in the Supabase Dashboard:

- **Project URL**: `https://xxxx.supabase.co` → this is `VITE_SUPABASE_URL`
- **anon/public key**: `eyJhbGci...` → this is `VITE_SUPABASE_ANON_KEY`
- **service_role key**: `eyJhbGci...` → this is used internally by Edge Functions (auto-injected)

## 3. Enable pgvector

Go to **Database → Extensions** in the dashboard:
- Search for `vector` and enable it
- Search for `pg_trgm` and enable it

## 4. Run Database Migration

Go to **SQL Editor** in the dashboard:
1. Click **New Query**
2. Copy-paste the contents of `supabase/migrations/001_schema.sql`
3. Click **Run**

This creates all the tables, triggers, indexes, hybrid search function, and superuser auto-setup.

**Superuser:** When `adedamolaadeusiofficial@gmail.com` signs up, the trigger automatically sets `is_superuser=true` with unlimited access.

## 5. Configure Auth

Email/password sign-in is **enabled by default** in Supabase. Just verify the settings:

Go to **Authentication → Sign In / Sign Up** (or **Configuration → Auth Providers** in older dashboards):
- Ensure **Email** is enabled (it should be by default)
- For development: Disable **Confirm email** (toggle it off so test users can sign in immediately)
- For production: Re-enable **Confirm email**

> **Note:** The Supabase dashboard layout varies by version. If you don't see "Sign In / Sign Up", look under **Authentication → Configuration** or **Authentication → Providers**.

## 6. Set Your OpenRouter API Key (IMPORTANT)

The OpenRouter API key is stored as a **Supabase Edge Function secret** — it is NOT in any .env file on your machine. The Edge Functions running on Supabase's servers use it to call OpenRouter for chat (deepseek/deepseek-v4-flash) and embeddings (qwen/qwen3-embedding-8b).

### Option A: Via Dashboard (Easiest)

1. Go to **Edge Functions** (left sidebar) in the Supabase Dashboard
2. Click the **Secrets** tab (or go to **Settings → Edge Functions → Secrets**)
3. Add these secrets one by one:

| Secret Name | Value | Where to get it |
|-------------|-------|-----------------|
| `OPENROUTER_API_KEY` | `sk-or-v1-xxxxx` | [openrouter.ai/keys](https://openrouter.ai/keys) |
| `PAYSTACK_SECRET_KEY` | `sk_test_xxxxx` | Paystack Dashboard → Settings → API Keys (add later) |
| `PAYSTACK_PUBLIC_KEY` | `pk_test_xxxxx` | Same as above (add later) |
| `PAYSTACK_MONTHLY_PLAN_CODE` | `PLN_xxxxx` | Paystack → Subscriptions → Plans (add later) |
| `PAYSTACK_YEARLY_PLAN_CODE` | `PLN_xxxxx` | Same as above (add later) |

> For now, you only need `OPENROUTER_API_KEY` to get AI chat working. The Paystack secrets can be added later when you set up payments.

### Option B: Via Supabase CLI

```bash
supabase secrets set OPENROUTER_API_KEY=sk-or-v1-xxxxx
```

## 7. Deploy Edge Functions

### Option A: Via Supabase CLI (Recommended)

Install CLI (pick one):
```bash
# Windows (scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# macOS
brew install supabase/tap/supabase

# npm (Linux/macOS only)
npm install -g supabase
```

Then:
```bash
supabase login
supabase link --project-ref YOUR_PROJECT_ID

supabase functions deploy ai-chat
supabase functions deploy ai-index
supabase functions deploy ai-status
supabase functions deploy ai-cancel
supabase functions deploy paystack-webhook
supabase functions deploy paystack-init
supabase functions deploy subscription-status
```

### Option B: Via Dashboard (Manual)

Go to **Edge Functions** in the dashboard:
1. For each function folder in `supabase/functions/`:
   - Click **Create Function**
   - Name it (e.g., `ai-chat`)
   - Paste the contents of `index.ts`
   - For functions that import from `../_shared/`, you'll need to use the CLI instead

> **Note:** If a function imports `../_shared/supabase-client.ts`, the CLI deploy is easier because it resolves imports automatically. The dashboard manual paste works for single-file functions only.

## 8. Configure Client Apps

Create `.env` files from the examples:

```bash
# Web client
cp web/client/.env.example web/client/.env
# Edit with your Supabase URL and anon key

# Desktop
cp desktop/.env.example desktop/.env

# Mobile
cp mobile/.env.example mobile/.env
```

Each `.env` file needs just two values (from Step 2):
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 9. Set Up Paystack (Optional — for payment)

1. Create account at [paystack.com](https://paystack.com)
2. Go to **Subscriptions → Plans**
3. Create two plans:
   - "LexStudent Monthly" - ₦1,500/month
   - "LexStudent Yearly" - ₦12,000/year
4. Note the plan codes (PLN_xxxxx)
5. Go to **Settings → API Keys** → copy Secret Key
6. Go to **Settings → Webhooks** → add:
   - URL: `https://YOUR_PROJECT.supabase.co/functions/v1/paystack-webhook`
   - Events: Select all subscription and charge events
7. Add Paystack secrets to Supabase Edge Functions (see Step 6)

## 10. Verify

1. Start the web app and register/login
2. Open browser console → should see Supabase auth sync
3. Navigate to a reading page → AI chat should work
4. After 5 messages → upgrade prompt appears (free users only)
5. Superuser (`adedamolaadeusiofficial@gmail.com`) has unlimited access automatically

## Superuser Management

To add more superusers later, run in SQL Editor:
```sql
UPDATE profiles SET is_superuser = true, subscription_status = 'active', ai_messages_limit = 999999
WHERE email = 'new-admin@example.com';
```

To add the email to the auto-setup trigger so new signups are automatically superusers:
```sql
-- Edit the trigger function and add emails to the IN list
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _is_super BOOLEAN := false;
  _sub_status TEXT := 'free';
  _msg_limit INTEGER := 5;
BEGIN
  IF NEW.email IN ('adedamolaadeusiofficial@gmail.com', 'another-admin@example.com') THEN
    _is_super := true;
    _sub_status := 'active';
    _msg_limit := 999999;
  END IF;

  INSERT INTO profiles (id, name, email, is_superuser, subscription_status, ai_messages_limit)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.email, ''),
    _is_super,
    _sub_status,
    _msg_limit
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```
