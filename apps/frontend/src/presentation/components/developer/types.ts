export interface LogEntry {
    level: string;
    message: string;
    timestamp: string;
    [key: string]: any;
}

export interface Metrics {
    uptime: number;
    memory: {
        rss: number;
        heapTotal: number;
        heapUsed: number;
        external: number;
    };
    cpu: {
        user: number;
        system: number;
    };
}
