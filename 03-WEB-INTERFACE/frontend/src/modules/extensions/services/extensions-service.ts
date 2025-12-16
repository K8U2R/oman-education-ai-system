import { apiClient } from '@/services/api/api-client';
import { Extension } from '../components/ExtensionCard';

class ExtensionsService {
  async getExtensions(): Promise<Extension[]> {
    try {
      return await apiClient.get<Extension[]>('/extensions');
    } catch (error) {
      // Return mock data if API fails
      return [
        {
          id: '1',
          name: 'React Snippets',
          description: 'مقتطفات كود React مفيدة',
          author: 'FlowForge Team',
          version: '1.0.0',
          rating: 4.8,
          downloads: 1250,
          installed: false,
          category: 'snippets',
        },
      ];
    }
  }

  async getExtension(id: string): Promise<Extension> {
    return await apiClient.get<Extension>(`/extensions/${id}`);
  }

  async installExtension(id: string): Promise<void> {
    await apiClient.post(`/extensions/${id}/install`);
  }

  async uninstallExtension(id: string): Promise<void> {
    await apiClient.delete(`/extensions/${id}`);
  }

  async updateExtensionSettings(id: string, settings: Record<string, unknown>): Promise<void> {
    await apiClient.put(`/extensions/${id}/settings`, settings);
  }
}

export const extensionsService = new ExtensionsService();

