# Supabase Setup Instructions

To connect your Sparks Detective Agency website to Supabase, follow these steps:

## 1. Create a Supabase Project
1.  Go to [supabase.com](https://supabase.com/) and create a new project.
2.  Get your **Project URL** and **Anon Key** from the project settings (API section).

## 2. Configure Environment Variables
Create a file named `.env.local` in the root of your project and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. Initialize Database Schema
Copy and paste the following SQL into the **SQL Editor** in your Supabase dashboard and run it:

```sql
-- 1. Create Cases Table
create table cases (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  mnf_ign text,
  case_type text,
  priority text,
  subject text,
  description text,
  evidence text,
  admin_finding text,
  is_confidential boolean default true,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

-- 2. Create Matchmaking Table
create table matchmaking (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  mnf_ign text,
  age integer,
  gender text,
  seeking_gender text,
  traits text[],
  looking_for text,
  ideal_date text,
  dealbreakers text,
  about_you text,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

-- 3. Create Prop Rentals Table
create table prop_rentals (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  mnf_ign text,
  prop_ids integer[],
  duration text,
  additional_notes text,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

-- 4. Create Contact Messages Table
create table contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  mnf_ign text,
  inquiry_type text,
  subject text,
  message text,
  is_urgent boolean default false,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

-- 5. Create Confessions Table
create table confessions (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  mood text,
  is_anonymous boolean default true,
  alias text,
  mnf_ign text,
  hearts integer default 0,
  is_pinned boolean default false,
  created_at timestamp with time zone default now()
);

-- 6. Create Testimonials Table
create table testimonials (
  id uuid default gen_random_uuid() primary key,
  name text,
  content text not null,
  rating integer not null check (rating between 1 and 5),
  is_anonymous boolean default false,
  is_hidden boolean default false,
  created_at timestamp with time zone default now()
);

-- 7. Create Settings Table (for Admin Password)
create table settings (
  key text primary key,
  value text
);

-- Insert Initial Admin Password
insert into settings (key, value) 
values ('admin_password', 'sparks2024admin');

-- 8. Create Live Chat Sessions Table
create table chat_sessions (
  id uuid default gen_random_uuid() primary key,
  session_key uuid not null unique default gen_random_uuid(),
  chat_code text not null unique,
  display_name text not null,
  mnf_ign text not null,
  status text default 'open' check (status in ('open', 'closed')),
  last_message_at timestamp with time zone default now(),
  last_message_preview text,
  unread_by_admin boolean default false,
  created_at timestamp with time zone default now()
);

-- 9. Create Live Chat Messages Table
create table chat_messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid not null references chat_sessions(id) on delete cascade,
  sender text not null check (sender in ('user', 'admin')),
  body text,
  attachment_url text,
  attachment_type text check (attachment_type is null or attachment_type = 'image'),
  created_at timestamp with time zone default now()
);

create index chat_messages_session_created_idx on chat_messages (session_id, created_at desc);
create index chat_sessions_last_message_idx on chat_sessions (last_message_at desc);
create index chat_sessions_chat_code_idx on chat_sessions (chat_code);

-- 6. Helper Function for Hearts (Optional but recommended)
create or replace function increment_hearts(confession_id uuid)
returns void as $$
begin
  update confessions
  set hearts = hearts + 1
  where id = confession_id;
end;
$$ language plpgsql;
```

## 4. Enable Row Level Security (RLS)
By default, these tables are protected. To allow users to submit forms, you should set up RLS policies:

*   **For `cases`, `matchmaking`, `prop_rentals`, `contact_messages`:**
    *   Policy: `Enable insert for everyone` (Public)
  *   Policy: `Enable select for everyone` (Public, required for the browser admin panel to display records)
    *   Policy: `Enable all for authenticated users` (If using Supabase Auth) OR `Enable all for admin access` (The current admin panel uses the secret route + password check).
*   **For `confessions`:**
    *   Policy: `Enable read for everyone` (Public)
    *   Policy: `Enable insert for everyone` (Public)
*   **For `testimonials`:**
  *   Policy: `Enable read for everyone where is_hidden = false` (Public, required for the testimonials page)
  *   Policy: `Enable insert for everyone` (Public)
*   **For `settings`:**
    *   Policy: `Enable read for everyone` (Public - needed for login check)
*   **For `chat_sessions`, `chat_messages`:**
    *   Policy: `Enable insert for everyone` (Public)
    *   Policy: `Enable select for everyone` (Public)
    *   Policy: `Enable update for everyone` (Public)
    *   Policy: `Enable delete for everyone` (Public, admin panel only in practice)

### Important: add table grants too
If you still get `permission denied for table ...`, you also need to grant PostgreSQL privileges to the `anon` role. Run this in the Supabase SQL editor after creating the tables:

```sql
grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on table public.cases to anon, authenticated;
grant select, insert, update, delete on table public.matchmaking to anon, authenticated;
grant select, insert, update, delete on table public.prop_rentals to anon, authenticated;
grant select, insert, update, delete on table public.contact_messages to anon, authenticated;
grant select, insert, update, delete on table public.confessions to anon, authenticated;
grant select, insert, update, delete on table public.testimonials to anon, authenticated;
grant select on table public.settings to anon, authenticated;
grant select, insert, update, delete on table public.chat_sessions to anon, authenticated;
grant select, insert, update, delete on table public.chat_messages to anon, authenticated;
```

If you want to keep the admin panel limited to your browser session, you can still use these grants and rely on RLS policies to decide what each role can actually do.

## 5. Live Chat Storage Bucket

In the Supabase dashboard, go to **Storage** and create a new public bucket:

- Bucket name: `chat-attachments`
- Public bucket: **Yes**

Then run this SQL to allow uploads from the anon role:

```sql
insert into storage.buckets (id, name, public)
values ('chat-attachments', 'chat-attachments', true)
on conflict (id) do nothing;

create policy "Public read chat attachments"
on storage.objects for select
using (bucket_id = 'chat-attachments');

create policy "Anyone can upload chat attachments"
on storage.objects for insert
with check (bucket_id = 'chat-attachments');

create policy "Anyone can delete chat attachments"
on storage.objects for delete
using (bucket_id = 'chat-attachments');
```

### Optional: clean up old chats (run manually to save DB space)

```sql
delete from chat_sessions
where last_message_at < now() - interval '30 days';
```

## 6. Admin Panel Usage
1.  Access the hidden route: `/sparks-admin-panel-7x9k`
2.  Login with the password: `sparks2024admin` (You can change this later in the Supabase `settings` table).
3.  Use the **Star** icon in the Confessions tab to pin the "Confession of the Month".
4.  Open any submission row to view the full record. In the Cases popup, the detective's notes are saved to the same case row through the `admin_finding` column, so the finding stays linked to that specific case.
5.  Use the new Testimonials page for live public reviews, then hide or delete reviews from the admin panel when needed.
