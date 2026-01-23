import { Component, ErrorInfo, ReactNode } from 'react'
import { ProfessionalErrorPanel } from '@/presentation/features/diagnostic-system-ads/components/ProfessionalErrorPanel/ProfessionalErrorPanel'
import { loggingService } from '@/infrastructure/services'
import { AppError } from '@/domain/exceptions'
import { Card } from '@/presentation/components/ui'
import { Button } from '@/presentation/components/ui'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
    errorInfo: ErrorInfo | null
}

export class RouteErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        }
    }

    public static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error,
        }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Logic Purge: Removed internal reportError, delegated to Sovereign Logging Service
        loggingService.error('RouteErrorBoundary caught an error', error, {
            componentStack: errorInfo.componentStack,
        })

        this.setState({
            error,
            errorInfo,
        })
    }

    private handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        })
    }

    public override render(): ReactNode {
        const { hasError, error } = this.state
        const { fallback, children } = this.props

        if (hasError && error) {
            if (fallback) {
                return fallback
            }

            // Convert standard Error to AppError for ADS if needed, or let ProfessionalErrorPanel handle it
            // ProfessionalErrorPanel expects AppError or IError interface usually, but adapts
            const displayError = error instanceof AppError ? error : {
                message: error.message,
                code: 'ROUTE_RENDER_ERROR',
                technicalDetails: {
                    service: 'Frontend',
                    file: 'RouteErrorBoundary.tsx',
                    stack: error.stack,
                    componentStack: this.state.errorInfo?.componentStack
                }
            }

            // ADS Integration: Use ProfessionalErrorPanel wrapped in a clean UI Card
            return (
                <div className="min-h-screen flex items-center justify-center p-6 bg-background">
                    <Card className="w-full max-w-4xl shadow-xl border-destructive/20">
                        <div className="p-6">
                            <ProfessionalErrorPanel
                                error={displayError}
                                onRetry={this.handleReset}
                            />
                            <div className="mt-6 flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => window.location.href = '/'}
                                >
                                    Home
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )
        }

        return children
    }
}
