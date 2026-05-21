/**
 * components/ui/Select.tsx
 *
 * Standard <select> dropdown. Shares styling with Input so form fields
 * look consistent. Supports all native <select> attributes.
 *
 * HOW TO USE:
 *   <Select>
 *     <option value="">All Statuses</option>
 *     <option value="Approved">Approved</option>
 *   </Select>
 */

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full bg-[var(--bg-inner)] text-[var(--text-main)]",
          "border border-transparent rounded-[var(--radius-btn)]",
          "px-4 py-3 font-[var(--font-body)] text-[0.9375rem]",
          "transition-[border-color,background-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
          "focus:outline-none focus:border-[var(--brand-primary)] focus:bg-[var(--bg-surface)]",
          "focus:shadow-[0_0_0_4px_var(--brand-primary-soft)]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </select>
    )
  }
)

Select.displayName = "Select"

export { Select }
