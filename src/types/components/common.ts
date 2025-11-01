import type { ReactNode } from "react";

/* ===================================
 * COMMON COMPONENT PROPS
 * ================================= */

export interface BaseComponentProps {
  className?: string;
  id?: string;
  "data-testid"?: string;
}

export interface PageLoaderProps {
  text?: string;
  size?: "small" | "medium" | "large";
  color?: string;
}

export interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  className?: string;
}

/* ===================================
 * NAVIGATION & UI PROPS
 * ================================= */

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: ReactNode;
  className?: string;
}

/* ===================================
 * PROVIDER PROPS
 * ================================= */

export interface UserProviderProps {
  children: ReactNode;
}

/* ===================================
 * LAYOUT PROPS
 * ================================= */

export interface MainLayoutProps {
  children: ReactNode;
}

export interface GuestLayoutProps {
  children: ReactNode;
}

export interface CustomerLayoutProps {
  children: ReactNode;
}

export interface FreelancerLayoutProps {
  children: ReactNode;
}
