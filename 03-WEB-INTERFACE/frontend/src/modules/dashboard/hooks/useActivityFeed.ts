import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard-service';

export function useActivityFeed(limit: number = 10) {
  return useQuery({
    queryKey: ['dashboard', 'activity-feed', limit],
    queryFn: () => dashboardService.getActivityFeed(limit),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

