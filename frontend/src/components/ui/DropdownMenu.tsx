/**
 * components/ui/DropdownMenu.tsx
 *
 * Accessible dropdown menu built on Radix UI's DropdownMenu primitive.
 * Replaces the old .dropdown-menu + toggle JS pattern.
 *
 * BENEFITS:
 * - Opens/closes on click automatically
 * - Closes on Escape key or click-outside
 * - Fully keyboard navigable (arrow keys, Enter, Escape)
 * - Announced to screen readers
 *
 * HOW TO USE:
 *   <DropdownMenu>
 *     <DropdownMenuTrigger asChild>
 *       <Button variant="ghost" size="icon"><SettingsIcon /></Button>
 *     </DropdownMenuTrigger>
 *     <DropdownMenuContent align="end">
 *       <DropdownMenuItem onSelect={toggleTheme}>Toggle Theme</DropdownMenuItem>
 *       <DropdownMenuSeparator />
 *       <DropdownMenuItem onSelect={() => navigate("/settings")}>
 *         App Settings
 *       </DropdownMenuItem>
 *     </DropdownMenuContent>
 *   </DropdownMenu>
 */

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        // Surface
        "z-200 min-w-[160px] bg-[var(--bg-surface)]",
        "border border-[var(--border-subtle)] rounded-[var(--radius-card)]",
        "p-[var(--space-2)] shadow-[0_12px_24px_-8px_rgba(0,0,0,0.1)]",
        "flex flex-col gap-[var(--space-1)]",
        // Animations
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex items-center gap-[var(--space-2)]",
      "w-full px-[var(--space-4)] py-[var(--space-2)]",
      "text-sm font-semibold text-[var(--brand-primary)] rounded-[var(--radius-btn)]",
      "cursor-pointer select-none outline-none",
      "transition-colors duration-[var(--duration-fast)]",
      "hover:bg-[var(--brand-primary-soft)]",
      "focus:bg-[var(--brand-primary-soft)]",
      "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("h-px bg-[var(--border-subtle)] my-[var(--space-1)]", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
}
