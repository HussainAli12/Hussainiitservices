-- Step 17: Sales CRM (customers, contacts, deals, activity log, follow-ups, team)
-- Run in Supabase → SQL Editor → New query. Safe to run more than once.
--
-- All tables are read and written only by the admin API with the service-role key, so RLS is
-- enabled with no public policies (nothing is reachable with the anon key).

CREATE OR REPLACE FUNCTION crm_touch_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sales team. No logins yet: members are picked as "logging as" in the admin.
CREATE TABLE IF NOT EXISTS crm_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A business (or individual) we sell to.
CREATE TABLE IF NOT EXISTS crm_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  lifecycle TEXT NOT NULL DEFAULT 'lead' CHECK (lifecycle IN ('lead', 'client', 'inactive')),
  industry TEXT,
  city TEXT,
  country TEXT DEFAULT 'India',
  address TEXT,
  website TEXT,
  instagram TEXT,
  source TEXT NOT NULL DEFAULT 'other',
  owner_id UUID REFERENCES crm_team_members(id) ON DELETE SET NULL,
  notes TEXT,
  -- Set when the customer was created from a website enquiry, so it is only converted once.
  contact_submission_id UUID UNIQUE REFERENCES contact_submissions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- People at the customer (owner, manager, accountant…).
CREATE TABLE IF NOT EXISTS crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES crm_customers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  instagram TEXT,
  preferred_channel TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A sales opportunity, e.g. "Website + SEO". Values are in INR.
CREATE TABLE IF NOT EXISTS crm_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES crm_customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  services TEXT[] NOT NULL DEFAULT '{}',
  value_inr NUMERIC(14, 2) NOT NULL DEFAULT 0,
  stage TEXT NOT NULL DEFAULT 'new' CHECK (
    stage IN ('new', 'contacted', 'discovery', 'requirements', 'proposal', 'negotiation', 'won', 'lost')
  ),
  owner_id UUID REFERENCES crm_team_members(id) ON DELETE SET NULL,
  expected_close DATE,
  lost_reason TEXT,
  closed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Every touchpoint: calls, WhatsApp, email, Instagram, meetings, notes.
CREATE TABLE IF NOT EXISTS crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES crm_customers(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES crm_deals(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE SET NULL,
  channel TEXT NOT NULL CHECK (channel IN ('call', 'whatsapp', 'email', 'instagram', 'meeting', 'website', 'note')),
  direction TEXT NOT NULL DEFAULT 'outbound' CHECK (direction IN ('outbound', 'inbound')),
  outcome TEXT,
  summary TEXT,
  duration_minutes INTEGER CHECK (duration_minutes IS NULL OR duration_minutes >= 0),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  team_member_id UUID REFERENCES crm_team_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Follow-ups: the next promised action.
CREATE TABLE IF NOT EXISTS crm_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES crm_customers(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES crm_deals(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'call' CHECK (type IN ('call', 'whatsapp', 'email', 'instagram', 'meeting', 'proposal', 'other')),
  due_at TIMESTAMPTZ NOT NULL,
  assignee_id UUID REFERENCES crm_team_members(id) ON DELETE SET NULL,
  done_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS crm_contacts_customer_idx ON crm_contacts (customer_id);
CREATE INDEX IF NOT EXISTS crm_deals_customer_idx ON crm_deals (customer_id);
CREATE INDEX IF NOT EXISTS crm_deals_stage_idx ON crm_deals (stage);
CREATE INDEX IF NOT EXISTS crm_activities_customer_idx ON crm_activities (customer_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS crm_activities_occurred_idx ON crm_activities (occurred_at DESC);
CREATE INDEX IF NOT EXISTS crm_tasks_open_idx ON crm_tasks (due_at) WHERE done_at IS NULL;
CREATE INDEX IF NOT EXISTS crm_tasks_customer_idx ON crm_tasks (customer_id);

DROP TRIGGER IF EXISTS crm_customers_touch ON crm_customers;
CREATE TRIGGER crm_customers_touch BEFORE UPDATE ON crm_customers
  FOR EACH ROW EXECUTE FUNCTION crm_touch_updated_at();

DROP TRIGGER IF EXISTS crm_deals_touch ON crm_deals;
CREATE TRIGGER crm_deals_touch BEFORE UPDATE ON crm_deals
  FOR EACH ROW EXECUTE FUNCTION crm_touch_updated_at();

ALTER TABLE crm_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_tasks ENABLE ROW LEVEL SECURITY;

-- Make the new tables visible to the API immediately.
NOTIFY pgrst, 'reload schema';
