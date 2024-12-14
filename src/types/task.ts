export type Task = {
  id: string;
  title: string;
  status: string;
  due_date: string | null;
  assigned_to: string | null;
  description: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type TaskFormValues = {
  title: string;
  status: string;
  due_date: string;
  assigned_to: string;
  description: string;
};