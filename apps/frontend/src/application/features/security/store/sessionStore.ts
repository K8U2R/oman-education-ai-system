/**
 * Session Store - Store الجلسات
 *
 * Zustand store لإدارة حالة الجلسات
 */

import { create } from 'zustand'
import type { Session, SessionDetails, SessionFilter } from '../types'

interface SessionState {
  // Sessions
  sessions: Session[]
  setSessions: (sessions: Session[]) => void
  addSession: (session: Session) => void
  updateSession: (id: string, updates: Partial<Session>) => void
  removeSession: (id: string) => void
  removeAllSessions: () => void

  // Selected Session
  selectedSession: SessionDetails | null
  setSelectedSession: (session: SessionDetails | null) => void

  // Filter
  filter: SessionFilter
  setFilter: (filter: SessionFilter) => void

  // UI State
  loading: boolean
  error: string | null
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Actions
  reset: () => void
}

const initialState = {
  sessions: [],
  selectedSession: null,
  filter: {},
  loading: false,
  error: null,
}

export const useSessionStore = create<SessionState>(set => ({
  ...initialState,

  // Sessions
  setSessions: sessions => set({ sessions }),
  addSession: session =>
    set(state => ({
      sessions: [session, ...state.sessions],
    })),
  updateSession: (id, updates) =>
    set(state => ({
      sessions: state.sessions.map(session =>
        session.id === id ? { ...session, ...updates } : session
      ),
    })),
  removeSession: id =>
    set(state => ({
      sessions: state.sessions.filter(session => session.id !== id),
      selectedSession: state.selectedSession?.id === id ? null : state.selectedSession,
    })),
  removeAllSessions: () =>
    set({
      sessions: [],
      selectedSession: null,
    }),

  // Selected Session
  setSelectedSession: session => set({ selectedSession: session }),

  // Filter
  setFilter: filter => set({ filter }),

  // UI State
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),

  // Reset
  reset: () => set(initialState),
}))
