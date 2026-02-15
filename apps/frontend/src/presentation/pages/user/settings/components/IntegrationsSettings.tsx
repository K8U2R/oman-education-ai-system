import React from 'react'
import { Cloud, CheckCircle2, AlertCircle, Share2 } from 'lucide-react'
import { Button, Card } from '@/presentation/components/common'
import { loggingService } from '@/infrastructure/services'

interface IntegrationProviderProps {
  name: string
  icon: React.ReactNode
  description: string
  isConnected: boolean
  onConnect: () => void
  onDisconnect: () => void
  colorClass?: string
}

const IntegrationProvider: React.FC<IntegrationProviderProps> = ({
  name,
  icon,
  description,
  isConnected,
  onConnect,
  onDisconnect,
  colorClass = 'bg-blue-50 text-blue-600',
}) => (
  <div className="integration-provider">
    <div className="integration-provider__info">
      <div className={`integration-provider__icon-wrapper ${colorClass}`}>{icon}</div>
      <div className="integration-provider__text">
        <h4 className="integration-provider__name">{name}</h4>
        <p className="integration-provider__description">{description}</p>
      </div>
    </div>
    <div className="integration-provider__actions">
      {isConnected ? (
        <>
          <span className="integration-provider__status">
            <CheckCircle2 size={16} />
            متصل
          </span>
          <Button variant="outline" size="sm" onClick={onDisconnect}>
            إلغاء الربط
          </Button>
        </>
      ) : (
        <Button variant="primary" size="sm" onClick={onConnect}>
          ربط الحساب
        </Button>
      )}
    </div>
  </div>
)

const IntegrationsSettings: React.FC = () => {
  return (
    <div className="integrations-settings">
      <Card className="integrations-settings__card">
        <div className="integrations-settings__card-header">
          <Share2 size={24} />
          <h3 className="integrations-settings__title">خدمات التخزين السحابي</h3>
        </div>

        <div className="integrations-settings__card-body">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 leading-relaxed">
            اربط حسابك بخدمات التخزين السحابي للوصول إلى ملفاتك ومزامنتها مباشرة مع دروسك ومشاريعك.
            يمكنك إدارة جميع ملفاتك التعليمية من مكان واحد.
          </p>

          <div className="integrations-settings__list">
            <IntegrationProvider
              name="Google Drive"
              description="الوصول إلى مستنداتك وجداول البيانات من جوجل"
              icon={<Cloud size={28} />}
              colorClass="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              isConnected={false}
              onConnect={() => loggingService.info('Connect Google Drive')}
              onDisconnect={() => loggingService.info('Disconnect Google Drive')}
            />

            <IntegrationProvider
              name="Dropbox"
              description="مزامنة ملفاتك وصورك من دروبوكس"
              icon={<Cloud size={28} />}
              colorClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
              isConnected={false}
              onConnect={() => loggingService.info('Connect Dropbox')}
              onDisconnect={() => loggingService.info('Disconnect Dropbox')}
            />

            <IntegrationProvider
              name="OneDrive"
              description="الوصول إلى ملفات مايكروسوفت أوفيس"
              icon={<Cloud size={28} />}
              colorClass="bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400"
              isConnected={false}
              onConnect={() => loggingService.info('Connect OneDrive')}
              onDisconnect={() => loggingService.info('Disconnect OneDrive')}
            />
          </div>
        </div>
      </Card>

      <div className="integrations-settings__alert-card">
        <AlertCircle className="alert-icon" size={24} />
        <div>
          <h4 className="alert-title">ملاحظة هامة</h4>
          <p className="alert-text">
            هذه الميزة متاحة حالياً لأغراض التطوير والإدارة فقط. يرجى التأكد من صلاحيات الوصول قبل
            ربط الحسابات الحقيقية. نحن نعمل حالياً على تحسين تجربة المزامنة التلقائية.
          </p>
        </div>
      </div>
    </div>
  )
}

export default IntegrationsSettings
