// src/hooks/useProjects.ts - Optimized Version
import { useState, useEffect, useCallback, useRef } from "react";
import { User } from "firebase/auth";
import { AssignedProjectWithDetails } from "../types/project";
import { fetchAssignedProjects } from "../services/projectService";

export const useProjects = (user: User | null) => {
  const [projects, setProjects] = useState<AssignedProjectWithDetails[]>([]);
  const [selectedProject, setSelectedProject] =
    useState<AssignedProjectWithDetails | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Use ref to track if we've already loaded projects for this user
  const loadedForUserRef = useRef<string | null>(null);
  const isInitialLoadRef = useRef(true);

  const loadProjects = useCallback(
    async (forceRefresh = false) => {
      if (!user?.uid) {
        console.log("No user UID, skipping project load");
        return;
      }

      // Avoid duplicate calls for the same user unless forced
      if (
        !forceRefresh &&
        loadedForUserRef.current === user.uid &&
        projects.length > 0
      ) {
        console.log("Projects already loaded for this user, skipping");
        return;
      }

      console.log("Loading projects for user:", user.uid);
      setLoadingProjects(true);
      setFetchError(null);

      try {
        const fetchedProjects = await fetchAssignedProjects(user);
        setProjects(fetchedProjects);
        loadedForUserRef.current = user.uid;

        // Auto-select first project if available and none selected, or if it's initial load
        if (fetchedProjects.length > 0) {
          if (!selectedProject || isInitialLoadRef.current) {
            setSelectedProject(fetchedProjects[0]);
            isInitialLoadRef.current = false;
          } else {
            // Try to maintain the same selected project after refresh
            const stillExists = fetchedProjects.find(
              (p) => p.projectId === selectedProject.projectId
            );
            if (stillExists) {
              setSelectedProject(stillExists);
            } else {
              setSelectedProject(fetchedProjects[0]);
            }
          }
        }
      } catch (error: any) {
        console.error("Error fetching projects:", error);
        setFetchError(error.message || "Failed to load projects");
        loadedForUserRef.current = null; // Reset on error so we can retry
      } finally {
        setLoadingProjects(false);
      }
    },
    [user?.uid]
  ); // Remove selectedProject from dependencies to prevent infinite loops

  // Load projects when user changes
  useEffect(() => {
    if (user?.uid) {
      // Only load if we haven't loaded for this user or if it's a different user
      if (loadedForUserRef.current !== user.uid) {
        loadProjects();
      }
    } else {
      // Clear projects when user signs out
      setProjects([]);
      setSelectedProject(null);
      setFetchError(null);
      loadedForUserRef.current = null;
      isInitialLoadRef.current = true;
    }
  }, [user?.uid, loadProjects]);

  const selectProject = useCallback(
    (projectId: string) => {
      const project = projects.find((p) => p.projectId === projectId);
      if (project) {
        setSelectedProject(project);
      }
    },
    [projects]
  );

  const refreshProjects = useCallback(() => {
    console.log("Manual refresh triggered");
    loadProjects(true); // Force refresh
  }, [loadProjects]);

  return {
    projects,
    selectedProject,
    loadingProjects,
    fetchError,
    selectProject,
    refreshProjects,
  };
};
