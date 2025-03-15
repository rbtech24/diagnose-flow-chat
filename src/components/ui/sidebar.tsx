
import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type SidebarContextValue = {
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(
  undefined
)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultExpanded?: boolean
}

export function SidebarProvider({
  children,
  defaultExpanded = true,
}: SidebarProviderProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] h-screen w-full">
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

export function SidebarTrigger() {
  const { expanded, setExpanded } = useSidebar()
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 absolute top-4 left-4 md:hidden z-50"
      onClick={() => setExpanded(!expanded)}
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  )
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const { expanded } = useSidebar()
  
  return (
    <div
      data-expanded={expanded}
      className={cn(
        "flex flex-col h-screen bg-card border-r fixed md:relative z-40 top-0 left-0 transition-all duration-300",
        expanded ? "w-64" : "w-0 md:w-16",
        className
      )}
      {...props}
    />
  )
}

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  const { expanded, setExpanded } = useSidebar()
  
  return (
    <div
      className={cn("p-4 h-14 flex items-center justify-between", className)}
      {...props}
    >
      {expanded && <div className="transition-opacity duration-300">{props.children}</div>}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 hidden md:flex transition-transform",
          !expanded && "mx-auto"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarContent({ className, ...props }: SidebarContentProps) {
  const { expanded } = useSidebar()
  return (
    <div className={cn("flex-1 overflow-auto p-3", expanded ? "" : "px-2", className)} {...props} />
  )
}

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  return <div className={cn("p-4 mt-auto", className)} {...props} />
}

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroup({ className, ...props }: SidebarGroupProps) {
  return (
    <div className={cn("pb-4", className)} {...props} />
  )
}

interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroupLabel({ className, ...props }: SidebarGroupLabelProps) {
  const { expanded } = useSidebar()
  
  if (!expanded) {
    return null
  }
  
  return (
    <div
      className={cn("text-xs font-medium text-muted-foreground px-2 py-1", className)}
      {...props}
    />
  )
}

interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroupContent({ className, ...props }: SidebarGroupContentProps) {
  return <div className={cn("space-y-1", className)} {...props} />
}

interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return <div className={cn("", className)} {...props} />
}

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarMenuItem({ className, ...props }: SidebarMenuItemProps) {
  return <div className={cn("", className)} {...props} />
}

interface SidebarMenuButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  active?: boolean
  asChild?: boolean
}

export function SidebarMenuButton({
  className,
  active,
  asChild = false,
  ...props
}: SidebarMenuButtonProps) {
  const { expanded } = useSidebar()
  const Component = asChild ? Button : "button"
  
  return (
    <Component
      className={cn(
        "group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200",
        active && "bg-muted text-foreground",
        expanded ? "justify-start" : "justify-center",
        className
      )}
      type={asChild ? undefined : "button"}
      variant={asChild ? undefined : "ghost"}
      {...props}
    >
      {React.Children.map(props.children, (child) => {
        if (React.isValidElement(child)) {
          if (!expanded && child.type === "span") {
            return null
          }
          if (!expanded && React.isValidElement(child) && typeof child.type === 'function' && 
              child.type.displayName && 
              child.type.displayName.includes('LucideIcon')) {
            return React.cloneElement(child, { 
              ...child.props, 
              className: cn(child.props.className, "mr-0") 
            });
          }
          return child
        }
        return child
      })}
    </Component>
  )
}
