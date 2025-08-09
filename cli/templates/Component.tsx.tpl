/**
 * Usage:
 *
 * <__COMPONENT_NAME__ className="custom">Content</__COMPONENT_NAME__>
 */
import React from 'react';
import styles from './__COMPONENT_NAME__.module.css';

export interface __COMPONENT_NAME__Props {
  className?: string;
  children?: React.ReactNode;
}

export const __COMPONENT_NAME__: React.FC<__COMPONENT_NAME__Props> = ({ className, children }) => {
  return <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>;
}; 