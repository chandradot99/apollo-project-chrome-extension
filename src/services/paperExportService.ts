// src/services/paperExportService.ts
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { ArXivPaper } from "../types/project";

export const exportPaperToProject = async (
  projectId: string,
  paperData: ArXivPaper
): Promise<void> => {
  if (!db) {
    throw new Error("Firebase not initialized");
  }

  try {
    // Clean the paper data to remove any undefined values
    const cleanPaperData = cleanObjectForFirestore(paperData);

    // Get reference to the project document
    const projectRef = doc(db, "projects", projectId);

    // First, check if the project exists and get current resources
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
      throw new Error("Project not found");
    }

    const projectData = projectSnap.data();
    const currentResources = projectData.resources || {};
    const currentPapers = currentResources.papers || [];

    // Check if paper already exists (prevent duplicates)
    const paperExists = currentPapers.some(
      (paper: ArXivPaper) => paper.id === cleanPaperData.id
    );

    if (paperExists) {
      throw new Error("This paper is already added to the project");
    }

    // Update the project document with the new paper
    await updateDoc(projectRef, {
      "resources.papers": arrayUnion(cleanPaperData),
    });

    console.log("Paper successfully exported to project:", projectId);
  } catch (error) {
    console.error("Error exporting paper to project:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to export paper to project"
    );
  }
};

// Helper function to clean object for Firestore (remove undefined values)
const cleanObjectForFirestore = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return null;
  }

  if (Array.isArray(obj)) {
    return obj
      .map((item) => cleanObjectForFirestore(item))
      .filter((item) => item !== undefined);
  }

  if (typeof obj === "object") {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanObjectForFirestore(value);
      }
    }
    return cleaned;
  }

  return obj;
};

export const checkPaperExists = async (
  projectId: string,
  arxivId: string
): Promise<boolean> => {
  if (!db) {
    return false;
  }

  try {
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
      return false;
    }

    const projectData = projectSnap.data();
    const papers = projectData.resources?.papers || [];

    return papers.some((paper: ArXivPaper) => paper.id === arxivId);
  } catch (error) {
    console.error("Error checking if paper exists:", error);
    return false;
  }
};
