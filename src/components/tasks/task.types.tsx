export type Priority = "low" | "medium" | "high" | "critical";
export type Status = "open" | "in_progress" | "closed";
export type Urgence = "low" | "medium" | "urgent";

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  urgence: Urgence;
  created_at: string;
  updated_at: string;
  user_id: number;
  deleted_at: string | null;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  urgence: Urgence;
}

export interface TaskFilters {
  priority?: Priority;
  status?: Status;
  urgence?: Urgence;
  search?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
