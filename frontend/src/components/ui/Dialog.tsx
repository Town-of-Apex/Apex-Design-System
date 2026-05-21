/**
 * components/ui/Dialog.tsx
 *
 * Modal dialog built on Radix UI's Dialog primitive.
 * This replaces the old #global-modal-overlay + JS injection pattern.
 *
 * BENEFITS OVER THE OLD PATTERN:
 * - Focus is trapped inside the dialog while it's open (accessibility)
 * - Escape key closes the dialog automatically
 * - Works without global JS state — controlled via React state
 * - Properly announces to screen readers via aria-modal
 *
 * SUBCOMPONENTS:
 *   Dialog        — the root (wraps everything, holds open state)
 *   DialogTrigger — the element that opens the dialog (usually a Button)
 *   DialogContent — the modal card itself (rendered in a portal)
 *   DialogHeader  — top section with title
 *   DialogTitle   — accessible title (required for screen readers)
 *   DialogFooter  — bottom section with action buttons
 *
 * HOW TO USE:
 *   const [open, setOpen] = useState(false)
 *
 *   <Dialog open={open} onOpenChange={setOpen}>
 *     <DialogTrigger asChild>
 *       <Button variant="primary">Open Dialog</Button>
 *     </DialogTrigger>
 *     <DialogContent>
 *       <DialogHeader>
 *         <DialogTitle>Confirm Action</DialogTitle>
 *       </DialogHeader>
 *       <p>Are you sure?</p>
 *       <DialogFooter>
 *         <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
 *         <Button variant="danger" onClick={handleConfirm}>Delete</Button>
 *       </DialogFooter>
 *     </DialogContent>
 *   </Dialog>
 */

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-[rgba(15,17,19,0.6)] backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Positioning
        "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
        // Sizing
        "w-full max-w-[500px]",
        // Surface
        "bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-modal)]",
        "shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)] overflow-hidden",
        // Animation
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      )}
      {...props}
    >
      {children}
      {/* Close button in top-right corner */}
      <DialogPrimitive.Close
        className={cn(
          "absolute right-4 top-4 rounded-[var(--radius-btn)] p-1",
          "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-inner)]",
          "transition-colors duration-[var(--duration-fast)]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
        )}
        aria-label="Close dialog"
      >
        <X className="h-4 w-4" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col gap-2 px-[var(--space-8)] py-[var(--space-6)]",
      "border-b border-[var(--border-subtle)]",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "font-[var(--font-ui)] font-extrabold text-[1.125rem] text-[var(--text-main)] m-0 text-left",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("px-[var(--space-8)] py-[var(--space-8)]", className)}
    {...props}
  />
)
DialogBody.displayName = "DialogBody"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex justify-end gap-[var(--space-3)]",
      "px-[var(--space-8)] py-[var(--space-6)]",
      "bg-[var(--bg-canvas)] border-t border-[var(--border-subtle)]",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
}
