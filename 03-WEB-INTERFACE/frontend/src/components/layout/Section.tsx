import React from 'react';
import { clsx } from 'clsx';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'surface' | 'muted';
}

const Section: React.FC<SectionProps> = ({
  padding = 'md',
  background = 'default',
  className,
  children,
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'py-4',
    md: 'py-8',
    lg: 'py-12',
    xl: 'py-16',
  };

  const backgrounds = {
    default: 'bg-ide-bg',
    surface: 'bg-ide-surface',
    muted: 'bg-ide-bg/50',
  };

  return (
    <section
      className={clsx(paddings[padding], backgrounds[background], className)}
      {...props}
    >
      {children}
    </section>
  );
};

export default Section;

