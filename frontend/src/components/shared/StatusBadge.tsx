/**
 * components/shared/StatusBadge.tsx
 *
 * Maps PermitStatus values to the correct Badge color variant.
 * Centralizes status → color logic so it's not duplicated across pages.
 *
 * HOW TO USE:
 *   <StatusBadge status="Approved" />
 *   <StatusBadge status="Rejected" />
 */

import { Badge } from "@/components/ui/Badge"
import type { PermitStatus } from "@/types/permit"
import type { BadgeProps } from "@/components/ui/Badge"

interface StatusBadgeProps {
  status: PermitStatus
}

const STATUS_VARIANT: Record<PermitStatus, BadgeProps["variant"]> = {
  Approved:      "success",
  Submitted:     "info",
  "Under Review": "warning",
  Rejected:      "error",
  Closed:        "default",
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANT[status]}>
      {status}
    </Badge>
  )
}
