export type Task = {
  id: string;
  title: string;
  status: string;
  due_date: string;
  assigned_to: string;
  created_at: string;
  updated_at: string;
};

export type TaskFormValues = {
  title: string;
  status: string;
  due_date: string;
  assigned_to: string;
};