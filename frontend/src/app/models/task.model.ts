export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  user: string;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  completed?: boolean;
}
