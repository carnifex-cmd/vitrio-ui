/**
 * Usage:
 *
 * <Navbar brand="MyApp">
 *   <a href="#home">Home</a>
 *   <a href="#about">About</a>
 * </Navbar>
 */
import React from 'react';
import styles from './Navbar.module.css';

export interface NavbarProps {
  brand?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ brand, children, className }) => (
  <nav className={[styles.navbar, className].filter(Boolean).join(' ')}>
    <div className={styles.brand}>{brand}</div>
    <div className={styles.links}>{children}</div>
  </nav>
); 