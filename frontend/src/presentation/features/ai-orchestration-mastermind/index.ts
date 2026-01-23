import { lazy } from 'react'

export const MastermindRouter = lazy(() =>
  import('./MastermindRouter').then(module => ({ default: module.MastermindRouter }))
)
