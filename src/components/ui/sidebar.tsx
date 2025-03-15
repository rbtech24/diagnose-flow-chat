
import React, { createContext, useContext, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarContextType = {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  expand: () => void;
  collapse: () => void;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  children?: React.ReactNode;
}

export function Sidebar({
  defaultExpanded = true,
  onExpandedChange,
  children,
  className,
  ...props
}: SidebarProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const expand = () => {
    setExpanded(true);
    onExpandedChange?.(true);
  };

  const collapse = () => {
    setExpanded(false);
    onExpandedChange?.(false);
  };

  const toggle = () => {
    setExpanded((prev) => {
      const next = !prev;
      onExpandedChange?.(next);
      return next;
    });
  };

  return (
    <SidebarContext.Provider
      value={{ expanded, setExpanded, expand, collapse, toggle }}
    >
      <div
        className={cn(
          "h-full flex flex-col bg-white border-r transition-all duration-300 ease-in-out shadow-sm",
          expanded ? "w-64" : "w-[70px]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function SidebarHeader({ children, className, ...props }: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "h-14 flex items-center px-4 border-b",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface SidebarMainProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function SidebarMain({ children, className, ...props }: SidebarMainProps) {
  return (
    <div className={cn("flex-1 overflow-auto", className)} {...props}>
      {children}
    </div>
  );
}

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function SidebarFooter({ children, className, ...props }: SidebarFooterProps) {
  return (
    <div
      className={cn("h-14 flex items-center px-4 border-t", className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function SidebarNav({ children, className, ...props }: SidebarNavProps) {
  return (
    <div className={cn("flex flex-col gap-1 px-2 py-2", className)} {...props}>
      {children}
    </div>
  );
}

interface SidebarNavItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode;
  active?: boolean;
  href?: string;
  children?: React.ReactNode;
}

export function SidebarNavItem({
  icon,
  active,
  href,
  children,
  className,
  ...props
}: SidebarNavItemProps) {
  const { expanded } = useSidebar();

  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
        active ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        !expanded && "justify-center",
        className
      )}
      {...props}
    >
      {icon && <div className="w-5 h-5">{icon}</div>}
      {expanded && <div>{children}</div>}
    </a>
  );
}

interface SidebarNavGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  children?: React.ReactNode;
}

export function SidebarNavGroup({
  label,
  children,
  className,
  ...props
}: SidebarNavGroupProps) {
  const { expanded } = useSidebar();

  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      {label && expanded && (
        <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase">
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

interface SidebarToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function SidebarToggle({ children, className, ...props }: SidebarToggleProps) {
  const { expanded, toggle } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        className
      )}
      {...props}
    >
      {children || (expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />)}
    </button>
  );
}

// Fix for TypeScript errors - Using type assertion to safely set displayName
// Instead of directly setting displayName which causes TypeScript errors
const components = [
  Sidebar, SidebarHeader, SidebarMain, SidebarFooter, 
  SidebarNav, SidebarNavItem, SidebarNavGroup, SidebarToggle
];

// Set displayName using type assertion to avoid TypeScript errors
components.forEach((Component) => {
  const functionName = Component.name;
  // Using type assertion to tell TypeScript this is safe
  (Component as any).displayName = functionName;
});

// Add SidebarProvider alias for compatibility with existing code
export const SidebarProvider = Sidebar;
export const SidebarContent = SidebarMain;
export const SidebarGroup = SidebarNavGroup;
export const SidebarGroupContent = SidebarNav;

// Update this component to accept className prop
interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}
export const SidebarGroupLabel = ({ children, className }: SidebarGroupLabelProps) => (
  <div className={cn("px-3 py-1 text-xs font-medium text-gray-500 uppercase", className)}>{children}</div>
);

export const SidebarMenu = SidebarNav;
export const SidebarMenuItem = SidebarNavItem;

// Update this component to accept active prop
interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
  active?: boolean;
  className?: string;
}

export const SidebarMenuButton = ({ 
  children, 
  asChild, 
  active, 
  className,
  ...props 
}: SidebarMenuButtonProps) => (
  <button 
    type="button" 
    className={cn(
      active ? "bg-gray-100 text-gray-900 font-medium" : "",
      className
    )} 
    {...props}
  >
    {children}
  </button>
);
