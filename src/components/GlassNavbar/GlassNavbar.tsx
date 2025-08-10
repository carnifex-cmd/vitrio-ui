import React, { useState } from 'react';
import styles from './GlassNavbar.module.css';

export interface NavItem {
  label: string;
  href: string;
}

export interface GlassNavbarProps {
  navItems: NavItem[];
  className?: string;
  /** Disable sticky positioning for special layouts (e.g., draggable demos). Defaults to false */
  disableSticky?: boolean;
}

const GlassNavbar: React.FC<GlassNavbarProps> = ({ navItems, className, disableSticky = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className={`${styles.container} ${!disableSticky ? styles.sticky : ''} ${className || ''}`}
      aria-label="Glass Navigation Bar"
    >
      <div className={styles.inner}>
        <div className={styles.brandSlot} />

        <ul className={styles.items}>
          {navItems.map((item) => (
            <li key={item.href} className={styles.item}>
              <a
                className={`${styles.glassButton} glass-base glass-shadow`}
                href={item.href}
              >
                <span className={styles.buttonLabel}>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={`${styles.hamburger} glass-base glass-shadow`}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span className={styles.hamburgerIcon} />
        </button>
      </div>

      {isOpen && (
        <div className={styles.dropdown} role="menu">
          {navItems.map((item) => (
            <a
              key={item.href}
              className={`${styles.dropdownItem} glass-base glass-shadow`}
              href={item.href}
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <span className={styles.buttonLabel}>{item.label}</span>
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default GlassNavbar;


