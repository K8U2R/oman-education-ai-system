import React from 'react'
import { Button } from '@/presentation/components/common'

const DatabaseQuickActions: React.FC = () => {
    return (
        <div style={{ padding: '1rem 0' }}>
            <Button variant="outline">Backup Now</Button>
            <Button variant="outline">Optimize Tables</Button>
        </div>
    )
}

export default DatabaseQuickActions
