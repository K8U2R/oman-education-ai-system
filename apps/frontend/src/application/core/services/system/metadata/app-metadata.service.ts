
import { RouteMetadata } from '@/presentation/routing/types'

class AppMetadataService {
    private static instance: AppMetadataService

    private constructor() { }

    public static getInstance(): AppMetadataService {
        if (!AppMetadataService.instance) {
            AppMetadataService.instance = new AppMetadataService()
        }
        return AppMetadataService.instance
    }

    public updateMetadata(metadata?: RouteMetadata): void {
        if (!metadata) return

        // Update Title
        if (metadata.title) {
            document.title = `${metadata.title} - Oman Education AI System`
        }

        // Update Description
        if (metadata.description) {
            const metaDescription = document.querySelector('meta[name="description"]')
            if (metaDescription) {
                metaDescription.setAttribute('content', metadata.description)
            } else {
                const meta = document.createElement('meta')
                meta.name = 'description'
                meta.content = metadata.description
                document.head.appendChild(meta)
            }
        }
    }
}

export const appMetadataService = AppMetadataService.getInstance()
