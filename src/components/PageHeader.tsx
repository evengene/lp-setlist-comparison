import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.13] mix-blend-overlay" />
      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-12">
        <p className="type-eyebrow text-ash">
          <span aria-hidden="true" className="mr-2 text-[18px] leading-none text-ember">→</span>
          {eyebrow}
        </p>
        <h1 className="type-page-title mt-4 text-bone">{title}</h1>
        {description && <p className="type-body-copy mt-4 max-w-xl text-bone-dim">{description}</p>}
      </div>
    </header>
  );
}
