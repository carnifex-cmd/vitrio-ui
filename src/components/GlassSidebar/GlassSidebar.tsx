import React, { useEffect, useMemo, useState } from 'react';
import styles from './GlassSidebar.module.css';

export interface GlassSidebarItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface GlassSidebarProps {
  menuItems: GlassSidebarItem[];
  position?: 'left' | 'right';
  isOpen: boolean;
  onClose?: () => void;
  /** If true, on desktop widths the sidebar remains docked instead of overlay. */
  dockedDesktop?: boolean;
  className?: string;
}

const GlassSidebar: React.FC<GlassSidebarProps> = ({
  menuItems,
  position = 'left',
  isOpen,
  onClose,
  dockedDesktop = false,
  className,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onClose) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const rootClasses = useMemo(() => {
    const sideClass = position === 'left' ? styles.left : styles.right;
    const openClass = isOpen ? styles.open : styles.closed;
    const dockClass = dockedDesktop ? styles.dockedDesktop : '';
    return `${styles.root} ${sideClass} ${openClass} ${dockClass} ${className || ''}`;
  }, [position, isOpen, dockedDesktop, className]);

  return (
    <div className={rootClasses} aria-hidden={!isOpen}>
      {/* Click-catcher overlay for closing when overlay mode */}
      {onClose && (
        <div
          className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
          onClick={() => onClose?.()}
          aria-hidden
        />
      )}

      <aside
        className={styles.panel}
        role="complementary"
        aria-label="Glass Sidebar"
        onClick={(e) => e.stopPropagation()}
      >
        <ul className={styles.menu}>
          {menuItems.map((item, index) => (
            <li key={`${item.label}-${index}`} className={styles.menuItemWrap}>
              <button
                type="button"
                className={`${styles.menuItem} glass-base glass-shadow ${
                  hoverIndex === index ? `${styles.menuItemHover} glass-hover glass-shadow-hover` : ''
                }`}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex((v) => (v === index ? null : v))}
                onClick={() => item.onClick?.()}
              >
                {item.icon && <span className={styles.icon}>{item.icon}</span>}
                <span className={styles.label}>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default GlassSidebar;


