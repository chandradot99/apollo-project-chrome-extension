import { Timestamp } from "firebase/firestore";

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  tasks: Task[];
  resources?: ProjectResources;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface AssignedProject {
  assignedProjectId: string;
  projectId: string;
  studentUid: string;
  studentName: string;
  teacherUid: string;
  assignedAt: Timestamp;
  status: "assigned" | "in-progress" | "completed" | "submitted";
}

export interface ArXivPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  subjects: string[];
  submittedDate: string;
  updatedDate?: string;
  pdfUrl: string;
  arxivUrl: string;
  doi?: string;
  categories: string[];
  comments?: string;
  addedAt: Timestamp;
  addedBy: string; // User ID who added this paper
}

export interface ResourceLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  addedAt: Timestamp;
}

export interface ResourceFile {
  id: string;
  name: string;
  url: string;
  type: string;
  addedAt: Timestamp;
}

export interface ProjectResources {
  papers?: ArXivPaper[];
  links?: ResourceLink[];
  files?: ResourceFile[];
}

export interface AssignedProjectWithDetails extends AssignedProject {
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  tasks: Task[];
}
