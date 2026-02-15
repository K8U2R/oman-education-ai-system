import React from 'react'
import { RefreshCw, Trash2, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/presentation/components/common'

interface CacheHeaderProps {
    onRefresh: () => void
    onCleanExpired: () => void
    onClearAll: () => void
}

export const CacheHeader: React.FC<CacheHeaderProps> = ({
    onRefresh,
    onCleanExpired,
    onClearAll,
}) => {
    const { t } = useTranslation()

    return (
        <div className="cache-page__header-actions">
            <Button variant="outline" size="sm" onClick={onRefresh} leftIcon={<RefreshCw size={16} />}>
                {t('admin.database.cache.actions.refresh')}
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={onCleanExpired}
                leftIcon={<Sparkles size={16} />}
            >
                {t('admin.database.cache.actions.clean_expired')}
            </Button>
            <Button
                variant="danger"
                size="sm"
                onClick={onClearAll}
                leftIcon={<Trash2 size={16} />}
            >
                {t('admin.database.cache.actions.clear_all')}
            </Button>
        </div>
    )
}
