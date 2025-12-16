import React, { useState } from 'react';
import { Link, Github, Database, Cloud } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

const IntegrationSettings: React.FC = () => {
  const [integrations, setIntegrations] = useState({
    github: { enabled: false, token: '' },
    supabase: { enabled: false, url: '', key: '' },
    netlify: { enabled: false, token: '' },
  });

  const toggleIntegration = (name: keyof typeof integrations) => {
    setIntegrations((prev) => ({
      ...prev,
      [name]: { ...prev[name], enabled: !prev[name].enabled },
    }));
  };

  const integrationsList = [
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      description: 'ربط مع GitHub للتحكم بالإصدارات',
    },
    {
      id: 'supabase',
      name: 'Supabase',
      icon: Database,
      description: 'ربط مع Supabase لقاعدة البيانات',
    },
    {
      id: 'netlify',
      name: 'Netlify',
      icon: Cloud,
      description: 'ربط مع Netlify للنشر',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Link className="w-5 h-5 text-ide-accent" />
          التكاملات
        </h2>
        <div className="space-y-4">
          {integrationsList.map((integration) => {
            const Icon = integration.icon;
            const integrationData = integrations[integration.id as keyof typeof integrations];
            return (
              <Card key={integration.id} variant="elevated">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-ide-accent" />
                    <div>
                      <h3 className="font-semibold">{integration.name}</h3>
                      <p className="text-sm text-ide-text-secondary">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant={integrationData.enabled ? 'success' : 'warning'}>
                    {integrationData.enabled ? 'مفعّل' : 'غير مفعّل'}
                  </Badge>
                </div>
                {integrationData.enabled && (
                  <div className="space-y-3 mt-4 pt-4 border-t border-ide-border">
                    {integration.id === 'github' && (
                      <Input
                        label="GitHub Token"
                        type="password"
                        value={integrationData.token}
                        onChange={(e) =>
                          setIntegrations((prev) => ({
                            ...prev,
                            github: { ...prev.github, token: e.target.value },
                          }))
                        }
                        placeholder="ghp_..."
                      />
                    )}
                    {integration.id === 'supabase' && (
                      <>
                        <Input
                          label="Supabase URL"
                          value={integrationData.url}
                          onChange={(e) =>
                            setIntegrations((prev) => ({
                              ...prev,
                              supabase: { ...prev.supabase, url: e.target.value },
                            }))
                          }
                          placeholder="https://..."
                        />
                        <Input
                          label="Supabase Key"
                          type="password"
                          value={integrationData.key}
                          onChange={(e) =>
                            setIntegrations((prev) => ({
                              ...prev,
                              supabase: { ...prev.supabase, key: e.target.value },
                            }))
                          }
                        />
                      </>
                    )}
                    {integration.id === 'netlify' && (
                      <Input
                        label="Netlify Token"
                        type="password"
                        value={integrationData.token}
                        onChange={(e) =>
                          setIntegrations((prev) => ({
                            ...prev,
                            netlify: { ...prev.netlify, token: e.target.value },
                          }))
                        }
                      />
                    )}
                  </div>
                )}
                <div className="flex justify-end mt-4">
                  <Button
                    variant={integrationData.enabled ? 'secondary' : 'primary'}
                    onClick={() => toggleIntegration(integration.id as keyof typeof integrations)}
                  >
                    {integrationData.enabled ? 'إلغاء التفعيل' : 'تفعيل'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IntegrationSettings;

