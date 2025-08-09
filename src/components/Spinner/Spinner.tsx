/**
 * Usage:
 *
 * <Spinner />
 */
import React from 'react';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  className?: string;
  size?: number;
}

export const Spinner: React.FC<SpinnerProps> = ({ className, size = 24 }) => (
  <div
    className={[styles.spinner, className].filter(Boolean).join(' ')}
    style={{ width: size, height: size }}
  />
); 