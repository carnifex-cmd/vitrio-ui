/**
 * Usage:
 *
 * <Switch checked={on} onChange={setOn} />
 */
import React from 'react';
import styles from './Switch.module.css';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, className }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    className={[styles.switch, checked ? styles.on : '', className].filter(Boolean).join(' ')}
    onClick={() => onChange(!checked)}
  >
    <span className={styles.knob} />
  </button>
); 