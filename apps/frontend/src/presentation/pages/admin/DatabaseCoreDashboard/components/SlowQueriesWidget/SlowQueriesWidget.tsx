import React from 'react'
import { Card } from '@/presentation/components/common'

const SlowQueriesWidget: React.FC<{ queries: any[] }> = ({ queries }) => {
    return <Card>Slow Queries: {queries?.length || 0}</Card>
}

export default SlowQueriesWidget
