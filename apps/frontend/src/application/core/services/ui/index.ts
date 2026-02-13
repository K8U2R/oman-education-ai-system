/**
 * UI Services - خدمات الواجهة
 */

// Design
export { themeService } from './design/theme.service'
export type { ThemeConfig, AgeTheme, ThemeMode } from './design/theme.service'

// Localization
export { i18nService } from './localization/i18n.service'
export type { Language, Direction } from './localization/i18n.service'

// Interaction
export { validationService, ValidationService } from './interaction/validation.service'
export type { ValidationRule, ValidationResult } from './interaction/validation.service'

export { searchService } from './interaction/search.service'
export type { SearchOptions, SearchResult } from './interaction/search.service'
