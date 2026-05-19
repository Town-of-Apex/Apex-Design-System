/**
 * components/ui/Badge.tsx
 *
 * Small status badge used for displaying state labels (e.g. permit status).
 *
 * VARIANTS match semantic state colors from the design system:
 *   default   — muted grey (neutral/unknown states)
 *   success   — forest green
 *   warning   — sunflower gold
 *   error     — cinnabar red
 *   info      — baltic blue
 *
 * HOW TO USE:
 *   <Badge>Active</Badge>
 *   <Badge variant="success">Approved</Badge>
 *   <Badge variant="error">Rejected</Badge>
 *   <Badge variant="warning">Under Review</Badge>
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center px-2 py-0.5 text-xs font-semibold uppercase tracking-wide rounded-[var(--radius-btn)]",
  {
    variants: {
      variant: {
        default: "bg-[var(--bg-inner)] text-[var(--text-muted)]",
        success: "bg-[rgba(63,135,63,0.12)] text-[var(--town-forest-green)]",
        warning: "bg-[rgba(243,189,72,0.15)] text-[#9a6e00]",
        error:   "bg-[rgba(215,87,66,0.12)] text-[var(--town-cinnabar)]",
        info:    "bg-[rgba(0,88,111,0.12)] text-[var(--town-baltic-blue)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
