import { apiClient } from '@/services/api/api-client';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import { GitStatus } from '../hooks/useGit';

class GitService {
  async getStatus(projectId: string): Promise<GitStatus> {
    try {
      return await apiClient.get<GitStatus>(API_ENDPOINTS.git.status(projectId));
    } catch (error) {
      // Return mock data if API fails
      return {
        branch: 'main',
        modified: 0,
        staged: 0,
        untracked: 0,
        files: [],
      };
    }
  }

  async commit(projectId: string, message: string, description?: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.git.commit(projectId), {
      message,
      description,
    });
  }

  async push(projectId: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.git.branch(projectId)}/push`);
  }

  async pull(projectId: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.git.branch(projectId)}/pull`);
  }

  async getBranches(projectId: string): Promise<string[]> {
    try {
      return await apiClient.get<string[]>(`${API_ENDPOINTS.git.branch(projectId)}/list`);
    } catch (error) {
      return ['main'];
    }
  }

  async switchBranch(projectId: string, branch: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.git.branch(projectId)}/switch`, { branch });
  }

  async getHistory(projectId: string, limit: number = 20): Promise<Array<{
    id: string;
    message: string;
    author: string;
    date: Date;
    hash: string;
  }>> {
    try {
      return await apiClient.get(`${API_ENDPOINTS.git.history(projectId)}?limit=${limit}`);
    } catch (error) {
      return [];
    }
  }
}

export const gitService = new GitService();

