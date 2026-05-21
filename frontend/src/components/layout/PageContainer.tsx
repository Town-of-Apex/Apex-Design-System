/**
 * components/layout/PageContainer.tsx
 *
 * Standard page content wrapper. Apply this inside every page component.
 *
 * It provides:
 *   - Max-width constraint (--container-width: 1152px)
 *   - Horizontal padding
 *   - Vertical section padding
 *
 * This replaces the .app-container + .section pattern from the old CSS.
 *
 * HOW TO USE:
 *   export function MyPage() {
 *     return (
 *       <PageContainer>
 *         <h1>My Page</h1>
 *       </PageContainer>
 *     )
 *   }
 */

import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(className)}
      style={{
        width:        "100%",
        maxWidth:     "var(--container-width)",
        margin:       "0 auto",
        padding:      "var(--space-11) var(--space-8)",
      }}
    >
      {children}
    </div>
  )
}
