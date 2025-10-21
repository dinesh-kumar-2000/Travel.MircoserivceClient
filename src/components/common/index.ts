// Common UI Components (existing components - using default exports)
export { Button } from './Button';
export { Card } from './Card';
export { ErrorBoundary } from './ErrorBoundary';
export { default as ErrorFallback } from './ErrorFallback';
export { Input } from './Input';
export { default as LazyImage } from './LazyImage';
export { default as LazyLoad } from './LazyLoad';
export { LoadingSpinner } from './LoadingSpinner';
export { Modal } from './Modal';
export { default as Select } from './Select';
export { default as Table } from './Table';

// New Components
export { CompactPagination, Pagination } from './Pagination';
export type { CompactPaginationProps, PaginationProps } from './Pagination';

export { Tabs, VerticalTabs } from './Tabs';
export type { Tab, TabsProps, VerticalTabsProps } from './Tabs';

export { Accordion, SimpleAccordion } from './Accordion';
export type {
  AccordionItem,
  AccordionProps,
  SimpleAccordionProps,
} from './Accordion';

export { SimpleTooltip, Tooltip } from './Tooltip';
export type { SimpleTooltipProps, TooltipProps } from './Tooltip';

export { Badge, NotificationBadge, StatusBadge } from './Badge';
export type {
  BadgeProps,
  NotificationBadgeProps,
  StatusBadgeProps,
} from './Badge';

export { Avatar, AvatarGroup } from './Avatar';
export type { AvatarGroupProps, AvatarProps } from './Avatar';

export {
  Skeleton,
  SkeletonCard,
  SkeletonList,
  SkeletonProfile,
  SkeletonTable,
} from './Skeleton';
export type { SkeletonProps } from './Skeleton';

export {
  Form,
  FormActions,
  FormField,
  FormGroup,
  FormHelperText,
  FormSection,
} from './Form';
export type {
  FormActionsProps,
  FormFieldProps,
  FormGroupProps,
  FormHelperTextProps,
  FormProps,
  FormSectionProps,
} from './Form';
