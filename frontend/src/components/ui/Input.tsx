/**
 * components/ui/Input.tsx
 *
 * Standard text input. Applies the Apex L2 surface styling (bg-inner).
 * Supports all native <input> attributes.
 *
 * HOW TO USE:
 *   <Input type="text" placeholder="Enter name..." />
 *   <Input type="email" required />
 */

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          // Surface L2 base
          "w-full bg-[var(--bg-inner)] text-[var(--text-main)]",
          "border border-transparent rounded-[var(--radius-btn)]",
          "px-4 py-3 font-[var(--font-body)] text-[0.9375rem]",
          // Transitions
          "transition-[border-color,background-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
          // Focus state — matches the CSS system's focus ring
          "focus:outline-none focus:border-[var(--brand-primary)] focus:bg-[var(--bg-surface)]",
          "focus:shadow-[0_0_0_4px_var(--brand-primary-soft)]",
          // Disabled
          "disabled:opacity-50 disabled:cursor-not-allowed",
          // File input override
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
