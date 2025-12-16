import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DocsLayout from './DocsLayout';
import PersonalSettings from './PersonalSettings';
import Introduction from './pages/Introduction';
import QuickStart from './pages/QuickStart';
import ProjectSettings from './pages/ProjectSettings';
import Installation from './pages/getting-started/Installation';
import Configuration from './pages/getting-started/Configuration';
import FirstProject from './pages/getting-started/FirstProject';
import AgentsModels from './pages/working/AgentsModels';
import BackupsRestore from './pages/working/BackupsRestore';
import Chatbox from './pages/working/Chatbox';
import CodeView from './pages/working/CodeView';
import ManagingProjects from './pages/working/ManagingProjects';
import GitHub from './pages/integrations/GitHub';
import Supabase from './pages/integrations/Supabase';
import Netlify from './pages/integrations/Netlify';
import Figma from './pages/integrations/Figma';
import LoginIssues from './pages/troubleshooting/LoginIssues';
import IntegrationIssues from './pages/troubleshooting/IntegrationIssues';
import FlowForgeIssues from './pages/troubleshooting/FlowForgeIssues';

const DocsRouter: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <DocsLayout>
            <Routes>
              <Route index element={<Introduction />} />
              <Route path="getting-started/introduction" element={<Introduction />} />
              <Route path="getting-started/quickstart" element={<QuickStart />} />
              <Route path="getting-started/installation" element={<Installation />} />
              <Route path="getting-started/configuration" element={<Configuration />} />
              <Route path="getting-started/first-project" element={<FirstProject />} />
              <Route path="working/personal-settings" element={<PersonalSettings />} />
              <Route path="working/project-settings" element={<ProjectSettings />} />
              <Route path="working/agents-models" element={<AgentsModels />} />
              <Route path="working/backups-restore" element={<BackupsRestore />} />
              <Route path="working/chatbox" element={<Chatbox />} />
              <Route path="working/code-view" element={<CodeView />} />
              <Route path="working/managing-projects" element={<ManagingProjects />} />
              <Route path="integrations/github" element={<GitHub />} />
              <Route path="integrations/supabase" element={<Supabase />} />
              <Route path="integrations/netlify" element={<Netlify />} />
              <Route path="integrations/figma" element={<Figma />} />
              <Route path="troubleshooting/login-issues" element={<LoginIssues />} />
              <Route path="troubleshooting/integration-issues" element={<IntegrationIssues />} />
              <Route path="troubleshooting/flowforge-issues" element={<FlowForgeIssues />} />
              <Route
                path="*"
                element={
                  <div className="text-center py-8 sm:py-12 chat-animate-fade-in">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 chat-text-primary">الصفحة غير موجودة</h2>
                    <p className="text-ide-text-secondary chat-text-secondary text-sm sm:text-base">
                      الصفحة التي تبحث عنها غير موجودة في التوثيق.
                    </p>
                  </div>
                }
              />
            </Routes>
          </DocsLayout>
        }
      />
    </Routes>
  );
};

export default DocsRouter;

