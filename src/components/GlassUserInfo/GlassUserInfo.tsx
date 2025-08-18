/**
 * GlassUserInfo - A user account/profile display component with glass styling
 * 
 * Usage:
 * <GlassUserInfo 
 *   user={{
 *     name: "John Doe",
 *     email: "john@example.com",
 *     avatar: "https://...",
 *     role: "Admin"
 *   }}
 *   onProfileClick={() => {}}
 *   onSettingsClick={() => {}}
 *   onLogoutClick={() => {}}
 * />
 */
import React, { useState, useCallback } from 'react';
import { CircularGlassButton } from '../CircularGlassButton/CircularGlassButton';
import styles from './GlassUserInfo.module.css';

export interface UserInfo {
  name: string;
  email?: string;
  role?: string;
  avatar?: string;
  isOnline?: boolean;
  notificationCount?: number;
}

export interface GlassUserInfoProps {
  user: UserInfo;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  onNotificationsClick?: () => void;
  className?: string;
  compact?: boolean;
}

const GlassUserInfo: React.FC<GlassUserInfoProps> = ({
  user,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  onNotificationsClick,
  className,
  compact = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleProfileClick = useCallback(() => {
    onProfileClick?.();
  }, [onProfileClick]);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const SettingsIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
    </svg>
  );

  const LogoutIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
    </svg>
  );

  const BellIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
    </svg>
  );

  return (
    <div 
      className={`${styles.container} glass-base glass-shadow ${
        isHovered ? 'glass-hover glass-shadow-hover' : ''
      } ${compact ? styles.compact : ''} ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label="User information"
    >
      {/* Main user info section */}
      <div 
        className={styles.userSection}
        onClick={handleProfileClick}
        role={onProfileClick ? "button" : undefined}
        tabIndex={onProfileClick ? 0 : undefined}
        onKeyDown={(e) => {
          if (onProfileClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleProfileClick();
          }
        }}
        aria-label={onProfileClick ? "View profile" : undefined}
      >
        {/* Avatar */}
        <div className={styles.avatarContainer}>
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={`${user.name}'s avatar`}
              className={styles.avatar}
              loading="lazy"
            />
          ) : (
            <div className={`${styles.avatarFallback} glass-base`} aria-hidden="true">
              {getInitials(user.name)}
            </div>
          )}
          
          {/* Online status indicator */}
          {user.isOnline !== undefined && (
            <div 
              className={`${styles.statusIndicator} ${user.isOnline ? styles.online : styles.offline}`}
              aria-label={user.isOnline ? "Online" : "Offline"}
            />
          )}
        </div>

        {/* User details */}
        {!compact && (
          <div className={styles.userDetails}>
            <div className={styles.name}>{user.name}</div>
            {user.role && (
              <div className={styles.role}>{user.role}</div>
            )}
            {user.email && (
              <div className={styles.email}>{user.email}</div>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className={styles.actions}>
        {/* Notifications */}
        {onNotificationsClick && (
          <div className={styles.actionButton}>
            <CircularGlassButton
              kind="custom"
              icon={BellIcon}
              size="sm"
              onClick={onNotificationsClick}
              ariaLabel={`Notifications${user.notificationCount ? ` (${user.notificationCount} new)` : ''}`}
            />
            {user.notificationCount !== undefined && user.notificationCount > 0 && (
              <div className={styles.notificationBadge} aria-hidden="true">
                {user.notificationCount > 99 ? '99+' : user.notificationCount}
              </div>
            )}
          </div>
        )}

        {/* Settings */}
        {onSettingsClick && (
          <div className={styles.actionButton}>
            <CircularGlassButton
              kind="custom"
              icon={SettingsIcon}
              size="sm"
              onClick={onSettingsClick}
              ariaLabel="Settings"
            />
          </div>
        )}

        {/* Logout */}
        {onLogoutClick && (
          <div className={styles.actionButton}>
            <CircularGlassButton
              kind="custom"
              icon={LogoutIcon}
              size="sm"
              variant="danger"
              onClick={onLogoutClick}
              ariaLabel="Logout"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GlassUserInfo;
