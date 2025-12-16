import { useState, useEffect, useCallback } from 'react';
import { Message } from '../components/MessageList';
import { StorageManager } from '../utils/storageManager';
import { validateSessions, sanitizeSession, ChatSessionSchema } from '../utils/dataValidator';
import { logger } from '../utils/logger';

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = 'ai-chat-history';
const MAX_SESSIONS = 50;

/**
 * Hook لإدارة تاريخ المحادثات مع التحقق من البيانات
 */
export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load sessions from localStorage مع التحقق من البيانات
  useEffect(() => {
    try {
      const stored = StorageManager.safeGetItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // التحقق من صحة البيانات
        const validation = validateSessions(parsed);
        
        if (validation.valid && validation.sanitized) {
          // Convert date strings back to Date objects
          const sessionsWithDates = (validation.sanitized as ChatSessionSchema[]).map((session) => ({
            ...session,
            createdAt: session.createdAt instanceof Date ? session.createdAt : new Date(session.createdAt),
            updatedAt: session.updatedAt instanceof Date ? session.updatedAt : new Date(session.updatedAt),
            messages: session.messages.map((msg) => ({
              ...msg,
              timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
            })),
          }));
          setSessions(sessionsWithDates);
          
          // تحديد الجلسة الحالية تلقائياً (آخر جلسة تم تحديثها)
          if (sessionsWithDates.length > 0 && !currentSessionId) {
            const lastSession = sessionsWithDates.sort((a, b) => 
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            )[0];
            setCurrentSessionId(lastSession.id);
            logger.info('تم تحديد الجلسة الحالية تلقائياً', { sessionId: lastSession.id });
          }
          
          logger.info('تم تحميل تاريخ المحادثات بنجاح', { count: sessionsWithDates.length });
        } else {
          // محاولة إصلاح البيانات
          logger.warn('بيانات تاريخ المحادثات تالفة، محاولة إصلاحها...', { error: validation.error });
          
          const fixedSessions: ChatSession[] = [];
          for (const session of parsed) {
            const fixed = sanitizeSession(session);
            if (fixed) {
              fixedSessions.push({
                ...fixed,
                createdAt: fixed.createdAt instanceof Date ? fixed.createdAt : new Date(fixed.createdAt),
                updatedAt: fixed.updatedAt instanceof Date ? fixed.updatedAt : new Date(fixed.updatedAt),
                messages: fixed.messages.map((msg) => ({
                  ...msg,
                  timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
                })),
              });
            }
          }
          
          if (fixedSessions.length > 0) {
            setSessions(fixedSessions);
            
            // تحديد الجلسة الحالية تلقائياً (آخر جلسة تم تحديثها)
            if (!currentSessionId) {
              const lastSession = fixedSessions.sort((a, b) => 
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
              )[0];
              setCurrentSessionId(lastSession.id);
              logger.info('تم تحديد الجلسة الحالية تلقائياً بعد الإصلاح', { sessionId: lastSession.id });
            }
            
            // حفظ البيانات المُصلحة
            const jsonData = JSON.stringify(fixedSessions);
            StorageManager.safeSetItem(STORAGE_KEY, jsonData);
            logger.info('تم إصلاح وحفظ تاريخ المحادثات', { count: fixedSessions.length });
          } else {
            logger.error('فشل إصلاح بيانات تاريخ المحادثات');
            // حذف البيانات التالفة
            StorageManager.safeRemoveItem(STORAGE_KEY);
          }
        }
      }
    } catch (error) {
      logger.error('فشل تحميل تاريخ المحادثات', error instanceof Error ? error : new Error(String(error)));
      // حذف البيانات التالفة
      StorageManager.safeRemoveItem(STORAGE_KEY);
    }
  }, []);

  // Save sessions to localStorage مع التحقق من الحجم
  const saveSessions = useCallback((newSessions: ChatSession[]) => {
    try {
      const limited = newSessions.slice(-MAX_SESSIONS);
      const jsonData = JSON.stringify(limited);
      
      // استخدام StorageManager للحفظ الآمن
      const result = StorageManager.safeSetItem(STORAGE_KEY, jsonData);
      
      if (result.success) {
        setSessions(limited);
        logger.debug('تم حفظ تاريخ المحادثات', { count: limited.length });
      } else {
        logger.error('فشل حفظ تاريخ المحادثات', undefined, { error: result.error });
        // محاولة حفظ عدد أقل من الجلسات
        if (limited.length > 1) {
          const reduced = limited.slice(-Math.floor(limited.length * 0.8));
          const reducedJson = JSON.stringify(reduced);
          const retryResult = StorageManager.safeSetItem(STORAGE_KEY, reducedJson);
          if (retryResult.success) {
            setSessions(reduced);
            logger.warn('تم حفظ عدد أقل من الجلسات بسبب نقص المساحة', { 
              original: limited.length, 
              saved: reduced.length 
            });
          }
        }
      }
    } catch (error) {
      logger.error('خطأ في حفظ تاريخ المحادثات', error instanceof Error ? error : new Error(String(error)));
    }
  }, []);

  // Create new session
  const createSession = useCallback((messages: Message[]) => {
    const firstUserMessage = messages.find(m => m.role === 'user');
    const session: ChatSession = {
      id: `session-${Date.now()}`,
      title: firstUserMessage?.content.substring(0, 50) || 'محادثة جديدة',
      messages,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const newSessions = [...sessions, session];
    saveSessions(newSessions);
    setCurrentSessionId(session.id);
    return session.id;
  }, [sessions, saveSessions]);

  // Update current session
  const updateSession = useCallback((sessionId: string, messages: Message[]) => {
    const firstUserMessage = messages.find(m => m.role === 'user');
    const newSessions = sessions.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          messages,
          updatedAt: new Date(),
          title: firstUserMessage?.content.substring(0, 50) || session.title,
        };
      }
      return session;
    });
    saveSessions(newSessions);
  }, [sessions, saveSessions]);

  // Delete session
  const deleteSession = useCallback((sessionId: string) => {
    const newSessions = sessions.filter(s => s.id !== sessionId);
    saveSessions(newSessions);
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  }, [sessions, saveSessions, currentSessionId]);

  // Get session
  const getSession = useCallback((sessionId: string) => {
    return sessions.find(s => s.id === sessionId);
  }, [sessions]);

  // Clear all sessions
  const clearAllSessions = useCallback(() => {
    saveSessions([]);
    setCurrentSessionId(null);
  }, [saveSessions]);

  return {
    sessions,
    currentSessionId,
    createSession,
    updateSession,
    deleteSession,
    getSession,
    clearAllSessions,
    setCurrentSessionId,
  };
}

