export type Lifecycle = "lead" | "client" | "inactive";
export type DealStage = "new" | "contacted" | "discovery" | "requirements" | "proposal" | "negotiation" | "won" | "lost";
export type Channel = "call" | "whatsapp" | "email" | "instagram" | "meeting" | "website" | "note";
export type Direction = "outbound" | "inbound";
export type TaskType = "call" | "whatsapp" | "email" | "instagram" | "meeting" | "proposal" | "other";

export interface CrmCustomer {
  id: string;
  name: string;
  lifecycle: Lifecycle;
  industry: string | null;
  city: string | null;
  country: string | null;
  address: string | null;
  website: string | null;
  instagram: string | null;
  source: string;
  notes: string | null;
  contact_submission_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CrmContact {
  id: string;
  customer_id: string;
  name: string;
  role: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  instagram: string | null;
  preferred_channel: Channel | null;
  is_primary: boolean;
  notes: string | null;
  created_at: string;
}

export interface CrmDeal {
  id: string;
  customer_id: string;
  title: string;
  services: string[];
  value_inr: number;
  stage: DealStage;
  expected_close: string | null;
  lost_reason: string | null;
  closed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CrmActivity {
  id: string;
  customer_id: string;
  deal_id: string | null;
  contact_id: string | null;
  channel: Channel;
  direction: Direction;
  outcome: string | null;
  summary: string | null;
  duration_minutes: number | null;
  occurred_at: string;
  created_at: string;
}

export interface CrmTask {
  id: string;
  customer_id: string;
  deal_id: string | null;
  title: string;
  type: TaskType;
  due_at: string;
  done_at: string | null;
  created_at: string;
}

/** Row in the customers list. */
export interface CrmCustomerRow extends CrmCustomer {
  primary_contact: Pick<CrmContact, "id" | "name" | "phone" | "whatsapp" | "email"> | null;
  open_deals: number;
  open_value: number;
  last_activity: Pick<CrmActivity, "channel" | "outcome" | "summary" | "occurred_at"> | null;
  next_task: Pick<CrmTask, "id" | "title" | "type" | "due_at"> | null;
}

/** Everything shown on a customer page. */
export interface CrmCustomerDetail {
  customer: CrmCustomer;
  contacts: CrmContact[];
  deals: CrmDeal[];
  activities: CrmActivity[];
  tasks: CrmTask[];
}

/** Deal card on the pipeline board. */
export interface CrmPipelineDeal extends CrmDeal {
  customer: Pick<CrmCustomer, "id" | "name" | "city">;
  last_activity_at: string | null;
}

export interface CrmTaskRow extends CrmTask {
  customer: Pick<CrmCustomer, "id" | "name">;
}

export interface CrmEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  created_at: string;
}

/** The "My day" dashboard. */
export interface CrmToday {
  tasks: CrmTaskRow[];
  goingCold: CrmPipelineDeal[];
  enquiries: CrmEnquiry[];
  activityToday: number;
  pipeline: { openValue: number; openDeals: number; wonThisMonth: number; wonValueThisMonth: number };
}
