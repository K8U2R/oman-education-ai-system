/**
 * Lessons Store - مخزن الدروس
 *
 * Zustand Store لإدارة حالة الدروس
 */

import { create } from 'zustand'
import { Lesson } from '@/domain/entities/Lesson'

interface LessonsState {
  lessons: Lesson[]
  currentLesson: Lesson | null
  isLoading: boolean
  error: string | null

  // Actions
  setLessons: (lessons: Lesson[]) => void
  setCurrentLesson: (lesson: Lesson | null) => void
  addLesson: (lesson: Lesson) => void
  updateLesson: (lesson: Lesson) => void
  removeLesson: (lessonId: string) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useLessonsStore = create<LessonsState>(set => ({
  lessons: [],
  currentLesson: null,
  isLoading: false,
  error: null,

  setLessons: lessons => set({ lessons }),
  setCurrentLesson: lesson => set({ currentLesson: lesson }),

  addLesson: lesson =>
    set(state => ({
      lessons: [...state.lessons, lesson],
    })),

  updateLesson: lesson =>
    set(state => ({
      lessons: state.lessons.map(l => (l.id === lesson.id ? lesson : l)),
      currentLesson: state.currentLesson?.id === lesson.id ? lesson : state.currentLesson,
    })),

  removeLesson: lessonId =>
    set(state => ({
      lessons: state.lessons.filter(l => l.id !== lessonId),
      currentLesson: state.currentLesson?.id === lessonId ? null : state.currentLesson,
    })),

  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ error }),
  clearError: () => set({ error: null }),
}))
