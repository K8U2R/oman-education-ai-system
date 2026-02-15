import React from 'react'
import { Card } from '@/presentation/components/common'

const ConnectionPoolWidget: React.FC<{ stats: any }> = ({ stats }) => {
    return <Card>Active Connections: {stats?.active || 0}</Card>
}

export default ConnectionPoolWidget
