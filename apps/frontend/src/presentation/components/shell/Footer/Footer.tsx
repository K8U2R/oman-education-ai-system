import React from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '@/domain/constants/routes.constants';
import { FOOTER_COLUMNS } from './footer.constants';
import { FooterBrand } from './components/Brand/FooterBrand';
import { FooterSection } from './components/Section/FooterSection';
import { FooterCopyright } from './components/Copyright/FooterCopyright';
import './Footer.scss';

// Routes where the footer should NOT be displayed
const HIDDEN_FOOTER_ROUTES: string[] = [
  ROUTES.LOGIN || '/login',
  ROUTES.REGISTER || '/register',
  '/404',
  '/500',
  // Dashboard & Authenticated Routes
  ROUTES.DASHBOARD || '/dashboard',
  ROUTES.PROJECTS || '/projects',
  ROUTES.LESSONS || '/lessons',
  ROUTES.ASSESSMENTS || '/assessments',
  ROUTES.STORAGE || '/storage',
  ROUTES.LESSONS_MANAGEMENT || '/lessons/manage',
  ROUTES.LEARNING_PATHS_MANAGEMENT || '/learning-paths/manage',
  ROUTES.CODE_GENERATOR || '/tools/code-generator',
  ROUTES.OFFICE_GENERATOR || '/tools/office-generator',
  // Admin Routes
  ROUTES.ADMIN_USERS || '/admin/users',
  ROUTES.ADMIN_WHITELIST || '/admin/whitelist',
  ROUTES.ADMIN_KNOWLEDGE || '/admin/knowledge',
  // Database Core Routes
  ROUTES.ADMIN_DATABASE_CORE_DASHBOARD || '/admin/database/core',
];

const Footer: React.FC = () => {
  const location = useLocation();

  // Check if current path is in hidden routes or starts with hidden prefixes
  const shouldHideFooter = HIDDEN_FOOTER_ROUTES.some(route => {
    if (!route) return false;
    // Exact match
    if (location.pathname === route) return true;
    // Sub-route match (e.g., /dashboard/settings)
    if (location.pathname.startsWith(route + '/')) return true;

    // Broad sections that should never have a footer
    const broadPrefixes = ['/dashboard', '/admin', '/tools', '/lessons', '/assessments', '/projects', '/storage'];
    if (broadPrefixes.some(prefix => location.pathname.startsWith(prefix))) return true;

    return false;
  });

  if (shouldHideFooter) {
    return null;
  }

  return (
    <footer className="footer sovereign-footer">
      <div className="footer__container">
        <div className="footer__grid">
          <FooterBrand />

          {FOOTER_COLUMNS.map((column, index) => (
            <FooterSection key={index} column={column} />
          ))}
        </div>

        <FooterCopyright />
      </div>
    </footer>
  );
};

export default Footer;
