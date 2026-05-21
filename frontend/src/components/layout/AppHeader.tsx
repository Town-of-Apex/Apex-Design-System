/**
 * components/layout/AppHeader.tsx
 *
 * The application header — sticky, contains branding, tab navigation,
 * settings dropdown, and user profile area.
 *
 * This is the React equivalent of the <header> block in core.html.
 * Branding is populated from useAppMetadata() instead of being hardcoded
 * or injected by apex-core.js.
 */

import { useNavigate, useLocation } from "react-router-dom"
import { Settings, User, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu"
import { useAppMetadata } from "@/hooks/useAppMetadata"
import { useTheme } from "@/hooks/useTheme"
import { NAV_ITEMS } from "@/lib/navigation"

export function AppHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const { metadata } = useAppMetadata()
  const { theme, toggleTheme } = useTheme()

  return (
    <header
      style={{
        height:           "var(--header-height)",
        background:       "var(--bg-surface)",
        borderBottom:     "1px solid var(--border-subtle)",
        position:         "sticky",
        top:              0,
        zIndex:           100,
        display:          "flex",
        alignItems:       "center",
        transition:       "background-color var(--duration-medium) var(--ease-standard)",
      }}
    >
      <div
        style={{
          width:     "100%",
          maxWidth:  "var(--container-width)",
          margin:    "0 auto",
          padding:   "0 var(--space-8)",
          display:   "flex",
          alignItems: "center",
          gap:       "var(--space-4)",
        }}
      >
        {/* ── Branding ───────────────────────────────────────────────── */}
        <button
          onClick={() => navigate("/")}
          aria-label="Go to home page"
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        "var(--space-4)",
            background: "none",
            border:     "none",
            cursor:     "pointer",
            padding:    0,
          }}
        >
          {/* Logo — masked SVG, color-matched to brand-primary */}
          <div
            aria-hidden="true"
            style={{
              width:               "var(--logo-size)",
              height:              "var(--logo-size)",
              flexShrink:          0,
              backgroundColor:     "var(--brand-primary)",
              WebkitMask:          `url(${import.meta.env.BASE_URL}logo.svg) no-repeat center`,
              mask:                `url(${import.meta.env.BASE_URL}logo.svg) no-repeat center`,
              WebkitMaskSize:      "contain",
              maskSize:            "contain",
              borderRadius:        "6px",
              transition:          "background-color var(--duration-medium) var(--ease-standard)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight:  600,
              fontSize:    "1.25rem",
              color:       "var(--brand-primary)",
              whiteSpace:  "nowrap",
            }}
          >
            {metadata?.title ?? "Apex Application"}
          </span>
        </button>

        {/* ── Tab Navigation ─────────────────────────────────────────── */}
        <nav
          aria-label="Main navigation"
          style={{
            display:    "flex",
            gap:        "var(--space-2)",
            marginLeft: "var(--space-8)",
            flex:       1,
          }}
        >
          {NAV_ITEMS.filter((item) => !item.hidden).map((item) => {
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                aria-current={isActive ? "page" : undefined}
                style={{
                  background:    isActive ? "var(--brand-primary-soft)" : "transparent",
                  border:        "none",
                  color:         isActive ? "var(--brand-primary)" : "var(--text-muted)",
                  fontSize:      "0.875rem",
                  fontWeight:    600,
                  padding:       "var(--space-2) var(--space-4)",
                  borderRadius:  "var(--radius-btn)",
                  cursor:        "pointer",
                  textDecoration: "none",
                  transition:    "all var(--duration-fast) var(--ease-standard)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--text-main)"
                    e.currentTarget.style.background = "var(--bg-inner)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--text-muted)"
                    e.currentTarget.style.background = "transparent"
                  }
                }}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* ── Right Controls ─────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginLeft: "auto" }}>

          {/* Settings dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open settings menu">
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={toggleTheme}>
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
                Toggle Theme
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate("/settings")}>
                <Settings className="w-4 h-4" />
                App Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User profile button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
            aria-label="User profile"
            style={{
              width:        "32px",
              height:       "32px",
              borderRadius: "50%",
              border:       "1px solid var(--border-subtle)",
            }}
          >
            <User style={{ width: "18px", height: "18px" }} />
          </Button>
        </div>
      </div>
    </header>
  )
}
