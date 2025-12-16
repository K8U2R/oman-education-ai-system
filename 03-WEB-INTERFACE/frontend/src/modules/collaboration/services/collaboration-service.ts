import { apiClient } from '@/services/api/api-client';
import { TeamMember } from '../components/TeamMember';

class CollaborationService {
  async getTeamMembers(projectId: string): Promise<TeamMember[]> {
    try {
      return await apiClient.get<TeamMember[]>(`/projects/${projectId}/team`);
    } catch (error) {
      // Return mock data if API fails
      return [];
    }
  }

  async inviteMember(projectId: string, email: string, role: TeamMember['role']): Promise<void> {
    await apiClient.post(`/projects/${projectId}/team/invite`, { email, role });
  }

  async removeMember(projectId: string, memberId: string): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/team/${memberId}`);
  }

  async updateMemberRole(
    projectId: string,
    memberId: string,
    role: TeamMember['role']
  ): Promise<void> {
    await apiClient.put(`/projects/${projectId}/team/${memberId}/role`, { role });
  }
}

export const collaborationService = new CollaborationService();

