export interface Consultant {
  id: string;
  name: string;
  specialty: string;
  personal_id: string;
  location: string;
  email: string;
  phone: string;
  status: string;
  image: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  consultant_name: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}