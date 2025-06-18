import { useState, useEffect, useCallback } from "react";
import { User } from "firebase/auth";
import { AssignedProjectWithDetails } from "../types/project";
import { fetchAssignedProjects } from "../services/projectService";

export const useProjects = (user: User | null) => {
  const [projects, setProjects] = useState<AssignedProjectWithDetails[]>([]);
  const [selectedProject, setSelectedProject] =
    useState<AssignedProjectWithDetails | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    if (!user?.uid) return;

    setLoadingProjects(true);
    setFetchError(null);

    try {
      const fetchedProjects = await fetchAssignedProjects(user);
      setProjects(fetchedProjects);

      // Auto-select first project if available and none selected
      if (fetchedProjects.length > 0 && !selectedProject) {
        setSelectedProject(fetchedProjects[0]);
      }
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      setFetchError(error.message || "Failed to load projects");
    } finally {
      setLoadingProjects(false);
    }
  }, [user?.uid, selectedProject]);

  // Load projects when user changes
  useEffect(() => {
    if (user) {
      loadProjects();
    } else {
      // Clear projects when user signs out
      setProjects([]);
      setSelectedProject(null);
      setFetchError(null);
    }
  }, [user, loadProjects]);

  const selectProject = (projectId: string) => {
    const project = projects.find((p) => p.projectId === projectId);
    setSelectedProject(project || null);
  };

  const refreshProjects = () => {
    loadProjects();
  };

  return {
    projects,
    selectedProject,
    loadingProjects,
    fetchError,
    selectProject,
    refreshProjects,
  };
};
