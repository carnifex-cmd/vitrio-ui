/**
 * Usage:
 *
 * <Button variant="primary" onClick={() => alert('clicked')}>Click me</Button>
 */
import React from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'secondary', className, ...props }) => {
  const classNames = [styles.button, styles[variant], className].filter(Boolean).join(' ');
  return <button className={classNames} {...props} />;
}; 