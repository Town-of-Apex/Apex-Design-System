/**
 * components/ui/Label.tsx
 *
 * Form field label. Always place this before an Input, Select, or Textarea.
 * Uses Radix UI's Label primitive for correct accessibility association.
 *
 * HOW TO USE:
 *   <Label htmlFor="my-input">Full Name</Label>
 *   <Input id="my-input" type="text" />
 */

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "@/lib/utils"

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-semibold text-[var(--text-main)] block mb-[var(--space-2)]",
      "leading-none peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))

Label.displayName = LabelPrimitive.Root.displayName

export { Label }
