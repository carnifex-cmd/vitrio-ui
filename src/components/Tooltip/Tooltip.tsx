/**
 * Usage:
 *
 * <Tooltip text="Helpful info"><Button>Hover me</Button></Tooltip>
 */
import React from 'react';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  text: string;
  children: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children, className }: TooltipProps) => (
  <span className={[styles.wrapper, className].filter(Boolean).join(' ')}>
    {children}
    <span className={styles.tooltip}>{text}</span>
  </span>
); 