import React from 'react'
import { Card } from '@/presentation/components/common'

const PerformanceMetricsWidget: React.FC<{ stats: any }> = ({ stats }) => {
    return <Card>Performance Metrics: {stats?.qps || 0} QPS</Card>
}

export default PerformanceMetricsWidget
