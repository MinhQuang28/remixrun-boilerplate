import { NavLink, type NavLinkProps } from '@remix-run/react';
import { cva } from 'class-variance-authority';

export const navigationLinkVariants = cva({
  base: [
    'group flex items-center gap-2 self-start text-sm -tracking-micro',
    'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200',
  ],
  variants: {
    isActive: {
      true: 'font-medium text-neutral-800 dark:text-neutral-200',
    },
  },
});

export const NavigationLink = ({ className, ...props }: NavLinkProps) => {
  return (
    <NavLink
      className={({ isActive }) =>
        // TODO fix typing for ui
        // @ts-ignore
        navigationLinkVariants({ isActive, className })
      }
      unstable_viewTransition
      {...props}
    />
  );
};
