/**
 * Usage:
 *
 * <Alert variant="success">Saved successfully!</Alert>
 */
import React from 'react';
import styles from './Alert.module.css';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  variant?: AlertVariant;
  children?: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ variant = 'info', children, className }) => {
  const classes = [styles.alert, styles[variant], className].filter(Boolean).join(' ');
  return <div className={classes}>{children}</div>;
}; 