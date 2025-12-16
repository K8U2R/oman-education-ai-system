import { apiClient } from '@/services/api/api-client';
import { API_ENDPOINTS } from '@/services/api/endpoints';

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalFiles: number;
  totalCommits: number;
  aiUsage: number;
  codingHours: number;
}

export interface ActivityItem {
  id: string;
  type: 'file' | 'commit' | 'ai' | 'build' | 'deploy';
  action: string;
  target: string;
  timestamp: Date;
  user?: string;
}

export interface RecentProject {
  id: string;
  name: string;
  lastModified: Date;
  fileCount: number;
  status: 'active' | 'archived';
}

class DashboardService {
  async getDashboardData() {
    // TODO: Replace with actual API call
    return {
      stats: await this.getStats(),
      recentProjects: await this.getRecentProjects(),
      activityFeed: await this.getActivityFeed(),
    };
  }

  async getStats(): Promise<DashboardStats> {
    try {
      return await apiClient.get<DashboardStats>(API_ENDPOINTS.dashboard.stats);
    } catch (error) {
      // Return mock data if API fails
      return {
        totalProjects: 24,
        activeProjects: 18,
        totalFiles: 156,
        totalCommits: 89,
        aiUsage: 234,
        codingHours: 156,
      };
    }
  }

  async getRecentProjects(limit: number = 5): Promise<RecentProject[]> {
    try {
      return await apiClient.get<RecentProject[]>(
        `${API_ENDPOINTS.dashboard.recentProjects}?limit=${limit}`
      );
    } catch (error) {
      // Return mock data
      return [
        {
          id: '1',
          name: 'Project Alpha',
          lastModified: new Date(),
          fileCount: 45,
          status: 'active',
        },
        {
          id: '2',
          name: 'Project Beta',
          lastModified: new Date(Date.now() - 3600000),
          fileCount: 32,
          status: 'active',
        },
      ];
    }
  }

  async getActivityFeed(limit: number = 10): Promise<ActivityItem[]> {
    try {
      return await apiClient.get<ActivityItem[]>(
        `${API_ENDPOINTS.dashboard.activityFeed}?limit=${limit}`
      );
    } catch (error) {
      // Return mock data
      return [
        {
          id: '1',
          type: 'file',
          action: 'تم تعديل ملف',
          target: 'App.tsx',
          timestamp: new Date(),
        },
        {
          id: '2',
          type: 'commit',
          action: 'تم إنشاء commit',
          target: 'feat: add new feature',
          timestamp: new Date(Date.now() - 3600000),
        },
      ];
    }
  }
}

export const dashboardService = new DashboardService();

