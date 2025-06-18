import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  Timestamp,
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
    // Query assigned projects for the current user
    const assignmentsRef = collection(db, "assignedProjects");
    const q = query(assignmentsRef, where("studentUid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    const fetchedAssignedProjects: AssignedProjectWithDetails[] = [];

    // Fetch project details for each assignment
    for (const assignedDoc of querySnapshot.docs) {
      const assignedData = assignedDoc.data();
      const projectId = assignedData.projectId;

      // Get project details
      const projectRef = doc(db, "projects", projectId);
      const projectDoc = await getDoc(projectRef);

      if (projectDoc.exists()) {
        const projectData = projectDoc.data() as ProjectIdea;
        fetchedAssignedProjects.push({
          assignedProjectId: assignedDoc.id,
          projectId: projectId,
          studentUid: assignedData.studentUid,
          studentName:
            assignedData.studentName || user.displayName || user.email || "N/A",
          teacherUid: assignedData.teacherUid,
          assignedAt: assignedData.assignedAt as Timestamp,
          status: assignedData.status,
          title: projectData.title,
          description: projectData.description,
          difficulty: projectData.difficulty,
          duration: projectData.duration,
          tasks: projectData.tasks || [],
        });
      } else {
        console.warn(
          `Project document with ID ${projectId} not found for student ${user.uid}. Skipping this assignment.`
        );
      }
    }

    return fetchedAssignedProjects;
  } catch (error) {
    console.error("Error fetching assigned projects for student:", error);
    throw new Error("Failed to load your projects. Please try again later.");
  }
};
