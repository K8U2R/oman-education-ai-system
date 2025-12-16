import { apiClient } from '@/services/api/api-client';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import { Project } from '@/utils/types';

class ProjectsService {
  async getProjects(): Promise<Project[]> {
    try {
      return await apiClient.get<Project[]>(API_ENDPOINTS.projects.list);
    } catch (error) {
      // Return mock data if API fails
      return [];
    }
  }

  async getProject(id: string): Promise<Project> {
    return await apiClient.get<Project>(`${API_ENDPOINTS.projects.detail}/${id}`);
  }

  async createProject(data: Partial<Project>): Promise<Project> {
    return await apiClient.post<Project>(API_ENDPOINTS.projects.create, data);
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    return await apiClient.put<Project>(`${API_ENDPOINTS.projects.detail}/${id}`, data);
  }

  async deleteProject(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.projects.detail}/${id}`);
  }

  async buildProject(id: string): Promise<{ success: boolean; message: string }> {
    return await apiClient.post(`${API_ENDPOINTS.projects.build}/${id}`);
  }

  async runProject(id: string): Promise<{ success: boolean; message: string }> {
    return await apiClient.post(`${API_ENDPOINTS.projects.run}/${id}`);
  }
}

export const projectsService = new ProjectsService();

