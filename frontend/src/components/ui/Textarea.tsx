/**
 * components/ui/Textarea.tsx
 *
 * Multi-line text input. Shares styling with Input.
 *
 * HOW TO USE:
 *   <Textarea rows={4} placeholder="Describe the scope of work..." />
 */

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full bg-[var(--bg-inner)] text-[var(--text-main)]",
          "border border-transparent rounded-[var(--radius-btn)]",
          "px-4 py-3 font-[var(--font-body)] text-[0.9375rem]",
          "leading-relaxed resize-y min-h-[80px]",
          "transition-[border-color,background-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
          "focus:outline-none focus:border-[var(--brand-primary)] focus:bg-[var(--bg-surface)]",
          "focus:shadow-[0_0_0_4px_var(--brand-primary-soft)]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea }
