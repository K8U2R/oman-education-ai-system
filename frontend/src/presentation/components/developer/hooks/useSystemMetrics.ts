import { useState, useEffect } from 'react';
import type { Metrics } from '../types';

export const useSystemMetrics = (refreshInterval = 5000) => {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/developer/cockpit/health`);
                const data = await response.json();
                if (data.success) {
                    setMetrics(data.metrics);
                }
            } catch (error) {
                console.error("Metrics Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, refreshInterval);
        return () => clearInterval(interval);
    }, [refreshInterval]);

    return { metrics, loading };
};
