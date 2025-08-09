/**
 * Usage:
 *
 * <Input placeholder="Your name" value={value} onChange={e => setValue(e.target.value)} />
 */
import React from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  const classNames = [styles.input, className].filter(Boolean).join(' ');
  return <input className={classNames} {...props} />;
}; 