/**
 * Usage:
 *
 * <Badge variant="success">New</Badge>
 */
import React from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'default';

export interface BadgeProps {
  variant?: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className }) => {
  const classes = [styles.badge, styles[variant], className].filter(Boolean).join(' ');
  return <span className={classes}>{children}</span>;
}; 