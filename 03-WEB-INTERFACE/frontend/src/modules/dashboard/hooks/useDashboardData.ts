import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard-service';

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard', 'data'],
    queryFn: () => dashboardService.getDashboardData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRecentProjects() {
  return useQuery({
    queryKey: ['dashboard', 'recent-projects'],
    queryFn: () => dashboardService.getRecentProjects(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useActivityFeed() {
  return useQuery({
    queryKey: ['dashboard', 'activity-feed'],
    queryFn: () => dashboardService.getActivityFeed(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

