export type MaterialStatus = "approved" | "pending" | "rejected";

export type MaterialType =
  | "Notes"
  | "PDF"
  | "Question Paper"
  | "Assignment"
  | "Practical File"
  | "Study Guide";

export interface Material {
  id: string;
  title: string;
  description: string;
  subject_id: string;
  category_id: string;
  user_id: string;
  course: string;
  semester: string;
  file_type: string;
  file_url: string;
  file_size: string | number;
  rating: number;
  downloads: number;
  tags: string[];
  status: MaterialStatus;
  thumbnail?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  // Included via JOINs in some queries
  subjects?: { name: string };
  categories?: { name: string };
  profiles?: { name: string };
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
  // App-specific additions not in DB schema but used in UI
  icon?: string;
  color?: string;
  count?: number;
}

export interface Favorite {
  id: string;
  user_id: string;
  material_id: string;
  created_at: string;
}

export interface DownloadRecord {
  id: string;
  user_id: string;
  material_id: string;
  downloaded_at: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  course: string;
  semester: string;
  role: "student" | "admin";
}

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

export interface Stat {
  label: string;
  value: string;
  icon: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  desc: string;
  icon: string;
}

export interface WhyChooseItem {
  title: string;
  desc: string;
  icon: string;
}

export interface Testimonial {
  id: number;
  name: string;
  course: string;
  college: string;
  review: string;
  rating: number;
  avatar: string;
}
