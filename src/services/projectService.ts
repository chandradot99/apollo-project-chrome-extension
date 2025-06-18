// src/services/projectService.ts - Optimized Version
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  Timestamp,
  documentId,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { User } from "firebase/auth";
import { AssignedProjectWithDetails, ProjectIdea } from "../types/project";

export const fetchAssignedProjects = async (
  user: User
): Promise<AssignedProjectWithDetails[]> => {
  if (!user?.uid || !db) {
    throw new Error("User not authenticated or Firebase not initialized");
  }

  try {
    console.time("fetchAssignedProjects"); // Performance timing

    // Query assigned projects for the current user
    const assignmentsRef = collection(db, "assignedProjects");
    const q = query(assignmentsRef, where("studentUid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.timeEnd("fetchAssignedProjects");
      return [];
    }

    // Extract project IDs and assignment data
    const assignments = querySnapshot.docs.map((doc) => ({
      assignedProjectId: doc.id,
      projectId: doc.data().projectId,
      data: doc.data(),
    }));

    const projectIds = assignments.map((a) => a.projectId);

    // Batch fetch all projects at once instead of individual requests
    const fetchedAssignedProjects: AssignedProjectWithDetails[] = [];

    // Split into chunks of 10 (Firestore 'in' query limit)
    const chunks = chunkArray(projectIds, 10);

    for (const chunk of chunks) {
      const projectsRef = collection(db, "projects");
      const projectsQuery = query(
        projectsRef,
        where(documentId(), "in", chunk)
      );
      const projectsSnapshot = await getDocs(projectsQuery);

      // Create a map for quick lookups
      const projectsMap = new Map();
      projectsSnapshot.docs.forEach((doc) => {
        projectsMap.set(doc.id, doc.data());
      });

      // Match assignments with their project data
      for (const assignment of assignments) {
        if (chunk.includes(assignment.projectId)) {
          const projectData = projectsMap.get(assignment.projectId);

          if (projectData) {
            fetchedAssignedProjects.push({
              assignedProjectId: assignment.assignedProjectId,
              projectId: assignment.projectId,
              studentUid: assignment.data.studentUid,
              studentName:
                assignment.data.studentName ||
                user.displayName ||
                user.email ||
                "N/A",
              teacherUid: assignment.data.teacherUid,
              assignedAt: assignment.data.assignedAt as Timestamp,
              status: assignment.data.status,
              title: projectData.title,
              description: projectData.description,
              difficulty: projectData.difficulty,
              duration: projectData.duration,
              tasks: projectData.tasks || [],
            });
          } else {
            console.warn(
              `Project document with ID ${assignment.projectId} not found for student ${user.uid}. Skipping this assignment.`
            );
          }
        }
      }
    }

    console.timeEnd("fetchAssignedProjects");
    console.log(
      `Fetched ${fetchedAssignedProjects.length} projects for user ${user.uid}`
    );

    return fetchedAssignedProjects;
  } catch (error) {
    console.error("Error fetching assigned projects for student:", error);
    throw new Error("Failed to load your projects. Please try again later.");
  }
};

// Helper function to chunk array into smaller arrays
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}
