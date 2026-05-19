/**
 * components/ui/Card.tsx
 *
 * Surface Level 1 container. Used for content grouping throughout the app.
 *
 * SUBCOMPONENTS:
 *   Card         — the outer wrapper
 *   CardHeader   — top section, usually contains title + description
 *   CardTitle    — the card's heading (h3-level semantically)
 *   CardContent  — main body area
 *   CardFooter   — bottom section, usually contains actions
 *
 * VARIANTS:
 *   default   — white/surface background
 *   subtle    — inner/recessed background (card--subtle in old CSS)
 *   highlight — left accent border (card--highlight in old CSS)
 *
 * HOW TO USE:
 *   <Card>
 *     <CardHeader>
 *       <CardTitle>Getting Started</CardTitle>
 *     </CardHeader>
 *     <CardContent>
 *       <p>Content goes here.</p>
 *     </CardContent>
 *   </Card>
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-[var(--radius-card)] transition-[transform,box-shadow] duration-[var(--duration-medium)] ease-[var(--ease-standard)]",
  {
    variants: {
      variant: {
        default:   "bg-[var(--bg-surface)] p-[var(--space-9)]",
        subtle:    "bg-[var(--bg-inner)] p-[var(--space-9)]",
        highlight: "bg-[var(--bg-surface)] p-[var(--space-9)] border-l-8 border-[var(--brand-primary)]",
      },
      interactive: {
        true: "cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.08)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, interactive }), className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-[var(--space-2)] mb-[var(--space-4)]", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-[var(--font-ui)] font-extrabold text-[1.125rem] text-[var(--text-main)] m-0 text-left",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-[var(--text-main)]", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-end gap-[var(--space-3)] pt-[var(--space-6)] mt-[var(--space-6)] border-t border-[var(--border-subtle)]",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardContent, CardFooter }
