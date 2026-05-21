/**
 * components/ui/Tabs.tsx
 *
 * Accessible tab navigation built on Radix UI's Tabs primitive.
 *
 * BENEFITS:
 * - Arrow key navigation between tabs automatically
 * - ARIA attributes applied correctly (role=tablist, role=tab, aria-selected)
 * - Controlled or uncontrolled usage
 *
 * HOW TO USE:
 *   <Tabs defaultValue="home">
 *     <TabsList>
 *       <TabsTrigger value="home">Home</TabsTrigger>
 *       <TabsTrigger value="permits">Permits</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="home">
 *       <HomePage />
 *     </TabsContent>
 *     <TabsContent value="permits">
 *       <PermitsPage />
 *     </TabsContent>
 *   </Tabs>
 */

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("flex gap-[var(--space-2)]", className)}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base tab styling — mirrors .tab-link from old CSS
      "bg-transparent border-none text-[var(--text-muted)]",
      "text-sm font-semibold px-[var(--space-4)] py-[var(--space-2)]",
      "rounded-[var(--radius-btn)] cursor-pointer",
      "transition-all duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
      "hover:text-[var(--text-main)] hover:bg-[var(--bg-inner)]",
      // Active state — mirrors .tab-link.active from old CSS
      "data-[state=active]:text-[var(--brand-primary)] data-[state=active]:bg-[var(--brand-primary-soft)]",
      // Focus state
      "focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] focus-visible:outline-offset-2",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] focus-visible:outline-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
