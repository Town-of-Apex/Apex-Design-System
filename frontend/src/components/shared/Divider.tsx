/**
 * components/shared/Divider.tsx
 *
 * A simple horizontal rule using the design system's border-subtle color.
 * Use between major page sections.
 *
 * HOW TO USE:
 *   <Divider />
 *   <Divider style={{ marginBlock: "var(--space-8)" }} />
 */

import { cn } from "@/lib/utils"

interface DividerProps {
  className?: string
  style?: React.CSSProperties
}

export function Divider({ className, style }: DividerProps) {
  return (
    <hr
      className={cn(className)}
      style={{
        border:     0,
        borderTop:  "1px solid var(--border-subtle)",
        margin:     0,
        ...style,
      }}
    />
  )
}
