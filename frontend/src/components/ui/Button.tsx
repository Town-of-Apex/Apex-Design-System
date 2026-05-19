/**
 * components/ui/Button.tsx
 *
 * The standard Apex button component.
 *
 * Built on shadcn/ui's pattern: uses class-variance-authority (cva) to define
 * variant styles, and forwards a ref so it can be used inside Radix primitives.
 *
 * VARIANTS:
 *   primary   — green fill, used for primary actions
 *   secondary — muted fill, used for secondary/cancel actions
 *   ghost     — transparent, used for icon buttons and settings controls
 *   danger    — red fill, used for destructive actions
 *
 * SIZES:
 *   default — standard button
 *   sm      — compact button
 *   icon    — square button for icon-only use
 *
 * HOW TO USE:
 *   <Button variant="primary" onClick={...}>Save</Button>
 *   <Button variant="danger" size="sm">Delete</Button>
 *   <Button variant="ghost" size="icon" aria-label="Settings"><SettingsIcon /></Button>
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles applied to every button
  [
    "inline-flex items-center justify-center gap-2",
    "font-semibold text-sm",
    "rounded-[var(--radius-btn)] border border-transparent",
    "cursor-pointer no-underline",
    "transition-all duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
    "focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] focus-visible:outline-offset-2",
    "active:scale-[0.97]",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-[var(--brand-primary)] text-white",
          "hover:bg-[var(--town-hunter-green)] hover:shadow-[0_4px_12px_rgba(68,105,61,0.2)]",
        ],
        secondary: [
          "bg-[var(--bg-inner)] text-[var(--text-main)]",
          "hover:bg-[var(--bg-surface)]",
        ],
        ghost: [
          "bg-transparent text-[var(--brand-primary)]",
          "hover:bg-[var(--brand-primary-soft)]",
        ],
        danger: [
          "bg-[var(--color-error)] text-white",
          "hover:brightness-110",
        ],
      },
      size: {
        default: "px-6 py-3",
        sm:      "px-3 py-2 text-xs",
        icon:    "w-9 h-9 p-0",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size:    "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
