import React from 'react'
import { Clock, LogOut } from 'lucide-react'
import { Card, Button } from '@/presentation/components/common'
import type { Session } from '@/features/system-administration-portal'

interface SessionManagerProps {
  sessions: Session[]
  terminating: string | null
  onTerminate: (id: string) => void
  onTerminateAll: () => void
}

/**
 * SessionManager - المكون المسؤول عن عرض وإدارة جلسات تسجيل الدخول النشطة
 */
export const SessionManager: React.FC<SessionManagerProps> = ({
  sessions,
  terminating,
  onTerminate,
  onTerminateAll,
}) => {
  return (
    <Card className="user-security-settings-page__card">
      <div className="user-security-settings-page__card-header">
        <Clock className="user-security-settings-page__card-icon" />
        <div>
          <h3 className="user-security-settings-page__card-title">الجلسات النشطة</h3>
          <p className="user-security-settings-page__card-description">
            إدارة الأجهزة والأماكن التي سجلت دخولك منها
          </p>
        </div>
      </div>
      <div className="user-security-settings-page__card-content">
        {sessions.length === 0 ? (
          <p className="user-security-settings-page__empty">لا توجد جلسات نشطة</p>
        ) : (
          <>
            <div className="user-security-settings-page__sessions">
              {sessions.map(session => (
                <div key={session.id} className="user-security-settings-page__session-item">
                  <div className="user-security-settings-page__session-info">
                    <div className="user-security-settings-page__session-header">
                      <h4 className="user-security-settings-page__session-device">
                        {session.deviceInfo?.deviceName ||
                          session.deviceInfo?.type ||
                          session.userAgent ||
                          'جهاز غير معروف'}
                      </h4>
                      {session.isCurrent && (
                        <span className="user-security-settings-page__session-badge">
                          الجلسة الحالية
                        </span>
                      )}
                    </div>
                    <p className="user-security-settings-page__session-location">
                      {session.location?.city && session.location?.country
                        ? `${session.location.city}, ${session.location.country}`
                        : session.location?.country || session.ipAddress || 'موقع غير معروف'}
                    </p>
                    <p className="user-security-settings-page__session-time">
                      آخر نشاط:{' '}
                      {session.lastActivityAt
                        ? new Date(session.lastActivityAt).toLocaleString('ar-OM')
                        : 'غير معروف'}
                    </p>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTerminate(session.id)}
                      disabled={terminating === session.id}
                      leftIcon={<LogOut />}
                    >
                      {terminating === session.id ? 'جاري الإنهاء...' : 'إنهاء الجلسة'}
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {sessions.filter(s => !s.isCurrent).length > 0 && (
              <div className="user-security-settings-page__session-actions">
                <Button
                  variant="outline"
                  onClick={onTerminateAll}
                  disabled={terminating === 'all'}
                  leftIcon={<LogOut />}
                >
                  {terminating === 'all'
                    ? 'جاري إنهاء جميع الجلسات...'
                    : 'إنهاء جميع الجلسات الأخرى'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  )
}
