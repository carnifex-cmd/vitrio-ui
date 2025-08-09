/**
 * Usage:
 *
 * <Card title="Profile"><div>Content</div></Card>
 */
import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className }) => (
  <div className={[styles.card, className].filter(Boolean).join(' ')}>
    {title ? <h3 className={styles.title}>{title}</h3> : null}
    {children}
  </div>
); 