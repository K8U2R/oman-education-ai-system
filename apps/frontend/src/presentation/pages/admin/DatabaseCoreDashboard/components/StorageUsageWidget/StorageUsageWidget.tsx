import React from 'react'
import { Card } from '@/presentation/components/common'

const StorageUsageWidget: React.FC<{ stats: any }> = ({ stats }) => {
    return <Card>Storage Usage: {stats?.used || '0GB'} / {stats?.total || '0GB'}</Card>
}

export default StorageUsageWidget
