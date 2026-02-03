/**
 * Animation Utilities - أدوات الرسوم المتحركة
 *
 * أدوات مساعدة للرسوم المتحركة والانتقالات
 */

export type AnimationType = 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce' | 'none'
export type AnimationDirection = 'up' | 'down' | 'left' | 'right'
export type AnimationTiming = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'

export interface AnimationConfig {
  type: AnimationType
  duration?: number
  delay?: number
  direction?: AnimationDirection
  timing?: AnimationTiming
}

/**
 * Generate CSS animation class name
 */
export const getAnimationClass = (config: AnimationConfig): string => {
  const { type, direction = 'up' } = config
  return `animate-${type}${direction !== 'up' ? `-${direction}` : ''}`
}

/**
 * Generate CSS transition style
 */
export const getTransitionStyle = (config: AnimationConfig): React.CSSProperties => {
  const { duration = 300, delay = 0, timing = 'ease-in-out' } = config
  return {
    transition: `all ${duration}ms ${timing}`,
    transitionDelay: `${delay}ms`,
  }
}

/**
 * Animation presets
 */
export const animationPresets = {
  fade: { type: 'fade' as const, duration: 300 },
  slideUp: { type: 'slide' as const, direction: 'up' as const, duration: 300 },
  slideDown: { type: 'slide' as const, direction: 'down' as const, duration: 300 },
  slideLeft: { type: 'slide' as const, direction: 'left' as const, duration: 300 },
  slideRight: { type: 'slide' as const, direction: 'right' as const, duration: 300 },
  scale: { type: 'scale' as const, duration: 200 },
  bounce: { type: 'bounce' as const, duration: 500 },
}

/**
 * Stagger animation delay
 */
export const getStaggerDelay = (index: number, baseDelay: number = 50): number => {
  return index * baseDelay
}
