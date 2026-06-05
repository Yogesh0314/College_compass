export interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number;
  collegeId: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Review {
  id: string;
  content: string;
  rating: number;
  userId: string;
  collegeId: string;
  createdAt: string | Date;
  user?: { name: string | null };
}

export interface College {
  id: string;
  name: string;
  description: string;
  location: string;
  fees: number;
  rating: number;
  placementRate: number;
  image?: string | null;
  courses: Course[];
  reviews?: Review[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface User {
  id: string;
  name?: string | null;
  email: string;
}

export interface Metadata {
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
