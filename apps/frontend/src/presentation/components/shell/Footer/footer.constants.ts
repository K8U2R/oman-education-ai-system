import { ROUTES } from '@/domain/constants/routes.constants';

export interface FooterLink {
    labelKey: string;
    href: string;
    isExternal?: boolean;
}

export interface FooterColumn {
    titleKey: string;
    links: FooterLink[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
    {
        titleKey: 'footer.columns.product.title',
        links: [
            { labelKey: 'footer.columns.product.links.home', href: ROUTES.HOME },
            { labelKey: 'footer.columns.product.links.features', href: '/features' },
            { labelKey: 'footer.columns.product.links.pricing', href: '/pricing' },
            { labelKey: 'footer.columns.product.links.roadmap', href: '/roadmap' },
        ],
    },
    {
        titleKey: 'footer.columns.resources.title',
        links: [
            { labelKey: 'footer.columns.resources.links.docs', href: '/docs' },
            { labelKey: 'footer.columns.resources.links.blog', href: '/blog' },
            { labelKey: 'footer.columns.resources.links.community', href: '/community' },
            { labelKey: 'footer.columns.resources.links.help', href: '/help' },
        ],
    },
];

export const LEGAL_LINKS: FooterLink[] = [
    { labelKey: 'footer.legal.privacy', href: '/privacy' },
    { labelKey: 'footer.legal.terms', href: '/terms' },
    { labelKey: 'footer.legal.cookies', href: '/cookies' },
    { labelKey: 'footer.legal.security', href: '/security' },
];

export const SOCIAL_LINKS = [
    { label: 'Twitter', href: 'https://twitter.com', isExternal: true },
    { label: 'LinkedIn', href: 'https://linkedin.com', isExternal: true },
    { label: 'GitHub', href: 'https://github.com', isExternal: true },
];
