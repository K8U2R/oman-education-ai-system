import { useState, useCallback } from 'react';
import { gitService } from '../services/git-service';

export interface GitStatus {
  branch: string;
  modified: number;
  staged: number;
  untracked: number;
  files: Array<{
    path: string;
    status: 'modified' | 'staged' | 'untracked';
  }>;
}

export function useGit(projectId: string) {
  const [status, setStatus] = useState<GitStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const gitStatus = await gitService.getStatus(projectId);
      setStatus(gitStatus);
    } catch (error) {
      console.error('Failed to fetch git status:', error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const commit = useCallback(
    async (message: string, description?: string) => {
      setIsLoading(true);
      try {
        await gitService.commit(projectId, message, description);
        await fetchStatus();
      } finally {
        setIsLoading(false);
      }
    },
    [projectId, fetchStatus]
  );

  const push = useCallback(async () => {
    setIsLoading(true);
    try {
      await gitService.push(projectId);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const pull = useCallback(async () => {
    setIsLoading(true);
    try {
      await gitService.pull(projectId);
      await fetchStatus();
    } finally {
      setIsLoading(false);
    }
  }, [projectId, fetchStatus]);

  return {
    status,
    isLoading,
    fetchStatus,
    commit,
    push,
    pull,
  };
}

