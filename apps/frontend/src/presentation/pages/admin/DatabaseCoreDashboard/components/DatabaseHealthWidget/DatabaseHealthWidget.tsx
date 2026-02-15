import React from 'react'
import { Card } from '@/presentation/components/common'

const DatabaseHealthWidget: React.FC<{ stats: any }> = ({ stats }) => {
    return <Card>Database Health: {stats?.status || 'Unknown'}</Card>
}

export default DatabaseHealthWidget
