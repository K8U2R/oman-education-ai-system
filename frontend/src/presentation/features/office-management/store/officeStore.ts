/**
 * Office Store - مخزن Office
 *
 * @description Zustand Store لإدارة حالة Office
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { officeService } from '../api/office.service'
import type {
  OfficeFileType,
  OfficeStyle,
  OfficeLanguage,
  OfficeTemplate,
  OfficeGenerationRequest,
  OfficeGenerationResponse,
} from '../types/office.types'

interface OfficeState {
  // State
  templates: OfficeTemplate[]
  currentGeneration: OfficeGenerationResponse | null
  generationHistory: OfficeGenerationResponse[]
  isLoading: boolean
  isGenerating: boolean
  error: string | null

  // Filters
  filters: {
    fileType?: OfficeFileType
    style?: OfficeStyle
    language?: OfficeLanguage
  }

  // Actions
  fetchTemplates: (type?: OfficeFileType) => Promise<void>
  generateOffice: (request: OfficeGenerationRequest) => Promise<OfficeGenerationResponse>
  setCurrentGeneration: (generation: OfficeGenerationResponse | null) => void
  addToHistory: (generation: OfficeGenerationResponse) => void
  clearHistory: () => void
  setFilter: (filter: Partial<OfficeState['filters']>) => void
  reset: () => void
}

const initialState = {
  templates: [],
  currentGeneration: null,
  generationHistory: [],
  isLoading: false,
  isGenerating: false,
  error: null,
  filters: {},
}

export const useOfficeStore = create<OfficeState>()(
  devtools(
    set => ({
      ...initialState,

      fetchTemplates: async type => {
        set({ isLoading: true, error: null })
        try {
          const templates = await officeService.getTemplates(type)
          set({ templates, isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load templates',
            isLoading: false,
          })
        }
      },

      generateOffice: async request => {
        set({ isGenerating: true, error: null })
        try {
          const response = await officeService.generateOffice(request)
          set(state => ({
            currentGeneration: response,
            generationHistory: [response, ...state.generationHistory],
            isGenerating: false,
          }))
          return response
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to generate file'
          set({
            error: errorMessage,
            isGenerating: false,
          })
          throw new Error(errorMessage)
        }
      },

      setCurrentGeneration: generation => {
        set({ currentGeneration: generation })
      },

      addToHistory: generation => {
        set(state => ({
          generationHistory: [generation, ...state.generationHistory],
        }))
      },

      clearHistory: () => {
        set({ generationHistory: [] })
      },

      setFilter: filter => {
        set(state => ({
          filters: {
            ...state.filters,
            ...filter,
          },
        }))
      },

      reset: () => {
        set(initialState)
      },
    }),
    { name: 'OfficeStore' }
  )
)
