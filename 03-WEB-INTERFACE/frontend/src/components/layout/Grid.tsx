import React from 'react';
import { clsx } from 'clsx';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  };
}

const Grid: React.FC<GridProps> = ({
  cols = 1,
  gap = 'md',
  responsive,
  className,
  children,
  ...props
}) => {
  const gaps = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const getColsClass = (cols: number) => {
    const colsMap: Record<number, string> = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      12: 'grid-cols-12',
    };
    return colsMap[cols] || 'grid-cols-1';
  };

  const responsiveClasses = responsive
    ? Object.entries(responsive)
        .map(([breakpoint, cols]) => {
          const breakpointMap: Record<string, string> = {
            sm: 'sm:',
            md: 'md:',
            lg: 'lg:',
            xl: 'xl:',
          };
          return `${breakpointMap[breakpoint]}${getColsClass(cols)}`;
        })
        .join(' ')
    : '';

  return (
    <div
      className={clsx(
        'grid',
        getColsClass(cols),
        gaps[gap],
        responsiveClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Grid;

