/**
 * Common Components - المكونات المشتركة
 */

export { RouteLoader, DefaultRouteLoader } from './RouteLoader'
export { SkeletonLoader } from './SkeletonLoader'
export { SkipLink } from './SkipLink'
export { OptimizedImage } from './OptimizedImage/OptimizedImage'
export { PWAInstallPrompt } from './PWAInstallPrompt'
export { FeatureGate, UpgradePrompt } from './FeatureGate'

// Inputs
import { Button, Input, Checkbox, Switch, Dropdown } from '../ui'
import type { CheckboxProps } from '../ui/inputs'

export { Button, Input, Checkbox, Switch, Dropdown }
export type { CheckboxProps }

// Layout
import { Card, Modal } from '../ui'
export { Card, Modal }

// Data Display
import { Badge, Avatar } from '../ui'
import type { BadgeVariant, BadgeSize, AvatarSize } from '../ui/data-display' // Keep specific type imports if not reachable via main index
export { Badge, Avatar }
export type { BadgeVariant, BadgeSize, AvatarSize }

// Feedback
import { Toast, LoadingSpinner } from '../ui'
export { Toast, LoadingSpinner }

// Composed / Legacy (To be moved later)
// Composed / Legacy (To be moved later)
// export type { ButtonProps } from '../ui/inputs/types' // Removed duplicate
export { ConfirmDialog } from './ConfirmDialog'
export type { ConfirmDialogVariant, ConfirmDialogProps } from './ConfirmDialog'
export { LoadingWrapper } from './LoadingWrapper'
export { DeleteConfirmModal } from './DeleteConfirmModal'
