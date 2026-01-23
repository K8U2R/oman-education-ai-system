import React from 'react'
import { AppShell } from '../components/shell/AppShell'

// PROXY ADAPTER:
// Mapping legacy MainLayout requests to the new Sovereign AppShell.
// This ensures backward compatibility while enforcing the new architecture.

import { PropsWithChildren } from 'react'

const MainLayout: React.FC<PropsWithChildren> = props => {
  return <AppShell {...props} />
}

export default MainLayout
