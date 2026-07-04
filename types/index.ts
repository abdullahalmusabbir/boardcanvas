export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  active: boolean;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: Priority;
  status: TaskStatus;
  task_date: string;
  due_date: string | null;
  order: number;
  tags: Tag[];
  created_at: string;
  updated_at: string;
}

export interface PolygonPoint {
  x: number;
  y: number;
}

export interface Polygon {
  id: number;
  image: number;
  label: string;
  color: string;
  points: PolygonPoint[];
  created_at: string;
  updated_at: string;
}

export interface AnnotationImage {
  id: number;
  title: string;
  image: string;
  order: number;
  uploaded_at: string;
  polygons: Polygon[];
}

/* polygon being drawn (not yet saved) */
export interface DraftPolygon {
  points: PolygonPoint[];
  label: string;
  color: string;
}