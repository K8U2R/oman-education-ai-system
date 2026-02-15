import React from 'react'
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/presentation/components/common'

type StatusType = 'idle' | 'verifying' | 'success' | 'error' | 'already_verified'
interface VerificationStatusProps {
    status: StatusType; error?: string | null; email?: string | null; children?: React.ReactNode
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({ status, error, email, children }) => {
    const { t } = useTranslation()

    interface ConfigEntry { icon: any; style: string; title: string; msg: string | null; spin?: boolean }
    const config: Record<StatusType, ConfigEntry> = {
        already_verified: { icon: CheckCircle2, style: 'success', title: 'already_verified_title', msg: 'already_verified_message' },
        success: { icon: CheckCircle2, style: 'success', title: 'success_title', msg: 'success_message' },
        error: { icon: XCircle, style: 'error', title: 'failed_title', msg: null },
        verifying: { icon: Loader2, style: 'loading', title: 'verifying_title', msg: 'verifying_message', spin: true },
        idle: { icon: Mail, style: '', title: 'default_title', msg: 'default_message' }
    }
    const { icon: Icon, style, title, msg, spin } = config[status] || config.idle

    return (
        <div className="verify-email-page">
            <Card className="verify-email-page__card">
                <div className="verify-email-page__content">
                    <div className={`verify-email-page__icon-wrapper${style ? ` verify-email-page__icon-wrapper--${style}` : ''}`}>
                        <Icon className={`verify-email-page__icon${spin ? ' verify-email-page__spinner' : ''}`} />
                    </div>
                    <h1 className="verify-email-page__title">{t(`auth.verify.${title}`)}</h1>
                    <p className={`verify-email-page__message${status === 'error' ? ' verify-email-page__message--error' : ''}`}>
                        {status === 'error' ? error : (msg ? t(`auth.verify.${msg}`, { email }) : '')}
                    </p>
                    {status === 'success' && <div className="verify-email-page__loading"><Loader2 className="verify-email-page__spinner" /></div>}
                    {children}
                </div>
            </Card>
        </div>
    )
}
