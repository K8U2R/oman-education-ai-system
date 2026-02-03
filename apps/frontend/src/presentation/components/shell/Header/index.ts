/**
 * Header - تصدير Header
 */

export { default } from './Header'
export { Header } from './Header'
export type { HeaderProps } from './types'

// Export sub-components
export {
  HeaderBrand,
  HeaderNavigation,
  HeaderSearch,
  HeaderActions,
  HeaderControls,
} from './components'

export type {
  HeaderBrandProps,
  HeaderNavigationProps,
  HeaderSearchProps,
  HeaderActionsProps,
  HeaderControlsProps,
} from './types'

// Export hooks
export { useHeader } from './hooks'
export type { UseHeaderOptions, UseHeaderReturn } from './types'

// Export constants
export { HEADER_CONFIG, HEADER_ACTIONS, HEADER_VARIANTS, HEADER_SIZES } from './constants'
