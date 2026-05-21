/**
 * pages/SettingsPage.tsx
 *
 * App settings page. Demonstrates complex form layouts with cards.
 * Added database status and user management for PostgreSQL verification.
 */

import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/shared/PageHeader"
import { Divider } from "@/components/shared/Divider"
import { Card } from "@/components/ui/Card"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Badge } from "@/components/ui/Badge"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { useTheme, type ColorSystem } from "@/hooks/useTheme"
import { dbService } from "@/services/dbService"
import type { DbStatus, User } from "@/types/db"

export function SettingsPage() {
  const { colorSystem, setColorSystem } = useTheme()

  const [settings, setSettings] = useState({
    primaryColor: "forest-green",
    accentColor: "sunflower-gold",
    muppet: "Gonzo the Great",
    somethingElse: true,
    emailNotifications: false,
    evenMoreThings: true,
  })

  // Database status states
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loadingDb, setLoadingDb] = useState(true)
  
  // Create user form state
  const [newUser, setNewUser] = useState({
    username: "",
    full_name: "",
    password: "",
    email: "",
    role: "Employee",
    department: ""
  })
  const [submittingUser, setSubmittingUser] = useState(false)

  // Fetch db status and users
  const loadDatabaseData = async () => {
    try {
      setLoadingDb(true)
      const status = await dbService.getStatus()
      setDbStatus(status)
      if (status.connected) {
        const userList = await dbService.getUsers()
        setUsers(userList)
      }
    } catch (err: any) {
      toast.error("Failed to connect to database status API", { description: err.message })
    } finally {
      setLoadingDb(false)
    }
  }

  useEffect(() => {
    loadDatabaseData()
  }, [])

  const handleSave = () => {
    toast.success("Settings saved", { description: "Your preferences have been updated." })
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUser.username.trim() || !newUser.full_name.trim() || !newUser.password.trim()) {
      toast.error("Required fields missing", { description: "Username, full name, and password are required." })
      return
    }
    
    try {
      setSubmittingUser(true)
      await dbService.createUser({
        username: newUser.username,
        full_name: newUser.full_name,
        password: newUser.password,
        email: newUser.email || undefined,
        role: newUser.role,
        department: newUser.department || undefined
      })
      toast.success("User created", { description: `Successfully created user ${newUser.username}` })
      setNewUser({
        username: "",
        full_name: "",
        password: "",
        email: "",
        role: "Employee",
        department: ""
      })
      // Refresh user list and DB metadata
      const userList = await dbService.getUsers()
      setUsers(userList)
      const status = await dbService.getStatus()
      setDbStatus(status)
    } catch (err: any) {
      toast.error("Failed to create user", { description: err.message })
    } finally {
      setSubmittingUser(false)
    }
  }

  const handleDeleteUser = async (id: number, username: string) => {
    if (!confirm(`Are you sure you want to permanently delete user '${username}'?`)) {
      return
    }
    try {
      await dbService.deleteUser(id)
      toast.success("User deleted", { description: `Removed user '${username}' from database.` })
      setUsers(users.filter(u => u.id !== id))
      // Refresh DB metadata
      const status = await dbService.getStatus()
      setDbStatus(status)
    } catch (err: any) {
      toast.error("Failed to delete user", { description: err.message })
    }
  }

  return (
    <PageContainer>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
        
        <PageHeader
          overline="System Preferences"
          title="App Settings"
          subtitle="Configure your application experience and view connection configurations."
        />

        <Divider />

        {/* ── ALERTS BANNERS ──────────────────────────────────────── */}
        {dbStatus?.fallback_active && (
          <div style={{
            backgroundColor: "rgba(241, 190, 72, 0.12)",
            border: "1px solid var(--town-sunflower-gold, #f1be48)",
            padding: "var(--space-4)",
            borderRadius: "var(--radius-card)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
            maxWidth: "800px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontWeight: 700, color: "#856404" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              DATABASE STATUS WARNING: SQLITE FALLBACK ACTIVE
            </div>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#664d03", fontWeight: 500 }}>
              {dbStatus.warning}
            </p>
            {dbStatus.error && (
              <pre style={{
                margin: "var(--space-2) 0 0",
                padding: "var(--space-2)",
                backgroundColor: "rgba(0,0,0,0.04)",
                borderRadius: "4px",
                fontSize: "0.75rem",
                overflowX: "auto",
                fontFamily: "monospace",
                color: "#664d03"
              }}>
                {dbStatus.error}
              </pre>
            )}
          </div>
        )}

        {dbStatus && !dbStatus.connected && (
          <div style={{
            backgroundColor: "rgba(215, 87, 66, 0.12)",
            border: "1px solid var(--town-cinnabar, #d75742)",
            padding: "var(--space-4)",
            borderRadius: "var(--radius-card)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
            maxWidth: "800px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontWeight: 700, color: "var(--town-cinnabar)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              DATABASE STATUS ERROR: NOT CONNECTED
            </div>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-main)", fontWeight: 500 }}>
              The application backend failed to establish any database connection. No reads or writes can be performed.
            </p>
            {dbStatus.error && (
              <pre style={{
                margin: "var(--space-2) 0 0",
                padding: "var(--space-2)",
                backgroundColor: "rgba(0,0,0,0.04)",
                borderRadius: "4px",
                fontSize: "0.75rem",
                overflowX: "auto",
                fontFamily: "monospace",
                color: "var(--town-cinnabar)"
              }}>
                {dbStatus.error}
              </pre>
            )}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-10)", maxWidth: "800px" }}>
          
          {/* ── Database Connection Status ─────────────────────────── */}
          <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: "1.125rem", color: "var(--text-main)", margin: 0 }}>
                Database Connection Status
              </h3>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={loadDatabaseData}
                disabled={loadingDb}
              >
                {loadingDb ? "Checking..." : "Refresh Status"}
              </Button>
            </div>
            
            <Card style={{ padding: "var(--space-6)" }}>
              {loadingDb && !dbStatus ? (
                <p style={{ color: "var(--text-muted)", margin: 0 }}>Loading database connection properties...</p>
              ) : dbStatus ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                  
                  {/* Status Banner inside card */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600 }}>Connection State</span>
                    <Badge variant={dbStatus.connected ? (dbStatus.fallback_active ? "warning" : "success") : "error"}>
                      {dbStatus.connected ? (dbStatus.fallback_active ? "SQLite Fallback" : "Connected (PostgreSQL)") : "Disconnected"}
                    </Badge>
                  </div>

                  <Divider />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "var(--space-3) var(--space-4)", fontSize: "0.875rem" }}>
                    
                    <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>Active Dialect</span>
                    <span style={{ fontWeight: 700, fontFamily: "var(--font-ui)", color: "var(--text-main)" }}>
                      {dbStatus.details?.dialect?.toUpperCase() || (dbStatus.fallback_active ? "sqlite" : "postgresql")}
                    </span>

                    <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>Engine Type</span>
                    <span style={{ fontWeight: 700, color: "var(--text-main)" }}>
                      {dbStatus.engine}
                    </span>

                    <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>Database URL</span>
                    <code style={{
                      wordBreak: "break-all",
                      fontSize: "0.75rem",
                      backgroundColor: "var(--bg-inner)",
                      padding: "2px 6px",
                      borderRadius: "4px"
                    }}>
                      {dbStatus.url}
                    </code>

                    {dbStatus.details?.version && (
                      <>
                        <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>DB Version</span>
                        <span style={{ fontSize: "0.8125rem", color: "var(--text-main)" }}>{dbStatus.details.version}</span>
                      </>
                    )}

                    {dbStatus.details?.active_connections !== undefined && (
                      <>
                        <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>Active Connections</span>
                        <span style={{ fontWeight: 600 }}>{dbStatus.details.active_connections}</span>
                      </>
                    )}

                    {dbStatus.details?.database_size && (
                      <>
                        <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>Database Size</span>
                        <span style={{ fontWeight: 600 }}>{dbStatus.details.database_size}</span>
                      </>
                    )}
                  </div>

                  <Divider />

                  {/* Registered Tables List */}
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.8125rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 var(--space-2)" }}>
                      Discovered Tables
                    </p>
                    {dbStatus.tables && dbStatus.tables.length > 0 ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                        {dbStatus.tables.map(table => (
                          <Badge key={table} variant="info">{table}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: 0 }}>No tables found. Check schema generation logs.</p>
                    )}
                  </div>

                </div>
              ) : (
                <p style={{ color: "var(--town-cinnabar)", margin: 0 }}>Unable to retrieve connection information.</p>
              )}
            </Card>
          </section>

          {/* ── User Management (Template Verification) ───────────────── */}
          {dbStatus?.connected && (
            <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <h3 style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: "1.125rem", color: "var(--text-main)", margin: 0 }}>
                Template User Management (Shared Schema Candidate)
              </h3>
              
              <Card style={{ padding: "var(--space-6)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: 0 }}>
                    Use this table to write to and read from the database, confirming the transaction functionality. In production, this table would reside in the shared database schema.
                  </p>

                  {/* User List Table */}
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", textAlign: "left" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid var(--border-strong)" }}>
                          <th style={{ padding: "8px", fontWeight: 700 }}>Username</th>
                          <th style={{ padding: "8px", fontWeight: 700 }}>Full Name</th>
                          <th style={{ padding: "8px", fontWeight: 700 }}>Role</th>
                          <th style={{ padding: "8px", fontWeight: 700 }}>Department</th>
                          <th style={{ padding: "8px", fontWeight: 700 }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan={5} style={{ padding: "var(--space-4)", textAlign: "center", color: "var(--text-muted)" }}>
                              No users currently in database. Register one below.
                            </td>
                          </tr>
                        ) : (
                          users.map(user => (
                            <tr key={user.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                              <td style={{ padding: "8px", fontWeight: 600 }}>{user.username}</td>
                              <td style={{ padding: "8px" }}>{user.full_name}</td>
                              <td style={{ padding: "8px" }}>
                                <Badge variant={user.role === "Administrator" ? "success" : "default"}>
                                  {user.role}
                                </Badge>
                              </td>
                              <td style={{ padding: "8px" }}>{user.department || "—"}</td>
                              <td style={{ padding: "8px" }}>
                                <Button 
                                  variant="secondary" 
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id, user.username)}
                                  style={{ padding: "4px 8px", fontSize: "0.75rem", minHeight: "auto", color: "var(--town-cinnabar)" }}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <Divider />

                  {/* Add User Form */}
                  <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                    <h4 style={{ margin: 0, fontWeight: 700, fontSize: "0.9375rem" }}>Create New User</h4>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                      <div>
                        <Label htmlFor="username">Username *</Label>
                        <Input 
                          id="username" 
                          type="text" 
                          value={newUser.username} 
                          onChange={(e) => setNewUser({...newUser, username: e.target.value})} 
                          placeholder="e.g. jdoe" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="full_name">Full Name *</Label>
                        <Input 
                          id="full_name" 
                          type="text" 
                          value={newUser.full_name} 
                          onChange={(e) => setNewUser({...newUser, full_name: e.target.value})} 
                          placeholder="e.g. John Doe" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password *</Label>
                        <Input 
                          id="password" 
                          type="password" 
                          value={newUser.password} 
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
                          placeholder="Min 6 chars" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={newUser.email} 
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
                          placeholder="e.g. jdoe@apexnc.org" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Select 
                          id="role" 
                          value={newUser.role} 
                          onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                        >
                          <option value="Employee">Employee</option>
                          <option value="Administrator">Administrator</option>
                          <option value="Citizen">Citizen</option>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input 
                          id="department" 
                          type="text" 
                          value={newUser.department} 
                          onChange={(e) => setNewUser({...newUser, department: e.target.value})} 
                          placeholder="e.g. Information Technology" 
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--space-2)" }}>
                      <Button type="submit" variant="primary" disabled={submittingUser}>
                        {submittingUser ? "Creating..." : "Add User"}
                      </Button>
                    </div>
                  </form>

                </div>
              </Card>
            </section>
          )}

          {/* ── Appearance ─────────────────────────────────────────── */}
          <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <h3 style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: "1.125rem", color: "var(--text-main)", margin: 0 }}>
              Appearance &amp; Theme
            </h3>
            
            <Card style={{ padding: "var(--space-6)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)" }}>
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--text-main)", margin: 0 }}>Color Theme System</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "var(--space-1) 0 0" }}>
                      Select the overall brand color scheme for the application.
                    </p>
                  </div>
                  <Select
                    value={colorSystem}
                    onChange={(e) => setColorSystem(e.target.value as ColorSystem)}
                    style={{ width: "200px" }}
                  >
                    <option value="default">Default (Forest & Gold)</option>
                    <option value="ocean">Ocean (Baltic & Cinnabar)</option>
                    <option value="sunset">Sunset (Cinnabar & Gold)</option>
                    <option value="forest">Deep Forest (Hunter & Olive)</option>
                  </Select>
                </div>
              </div>
            </Card>
          </section>

          {/* ── General ────────────────────────────────────────────── */}
          <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <h3 style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: "1.125rem", color: "var(--text-main)", margin: 0 }}>
              General
            </h3>
            
            <Card style={{ padding: "var(--space-6)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)" }}>
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--text-main)", margin: 0 }}>Placeholder Dropdown</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "var(--space-1) 0 0" }}>
                      Who is the coolest Muppet?
                    </p>
                  </div>
                  <Select
                    value={settings.muppet}
                    onChange={(e) => setSettings({ ...settings, muppet: e.target.value })}
                    style={{ width: "200px" }}
                  >
                    <option value="Dr. Teeth">Dr. Teeth</option>
                    <option value="Animal">Animal</option>
                    <option value="Gonzo the Great">Gonzo the Great</option>
                    <option value="Rowlf the Dog">Rowlf the Dog</option>
                    <option value="Beaker">Beaker</option>
                    <option value="Swedish Chef">Swedish Chef</option>
                  </Select>
                </div>

                <Divider />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)" }}>
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--text-main)", margin: 0 }}>Something Else</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "var(--space-1) 0 0" }}>
                      This should probably have a checkbox or toggle switch or something.
                    </p>
                  </div>
                  <label style={{ position: "relative", display: "inline-block", width: "44px", height: "24px", flexShrink: 0 }}>
                    <input
                      type="checkbox"
                      checked={settings.somethingElse}
                      onChange={(e) => setSettings({ ...settings, somethingElse: e.target.checked })}
                      style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
                    />
                    <span
                      style={{
                        position:        "absolute",
                        cursor:          "pointer",
                        inset:           0,
                        backgroundColor: settings.somethingElse ? "var(--brand-primary)" : "var(--bg-inner)",
                        borderRadius:    "var(--radius-btn)",
                        border:          `1px solid ${settings.somethingElse ? "var(--brand-primary)" : "var(--border-strong)"}`,
                        transition:      "all var(--duration-fast) var(--ease-standard)",
                      }}
                    >
                      <span
                        style={{
                          position:        "absolute",
                          height:          "16px",
                          width:           "16px",
                          left:            "3px",
                          bottom:          "3px",
                          backgroundColor: "white",
                          borderRadius:    "4px",
                          transition:      "all var(--duration-fast) var(--ease-standard)",
                          transform:       settings.somethingElse ? "translateX(20px)" : "translateX(0)",
                        }}
                      />
                    </span>
                  </label>
                </div>
              </div>
            </Card>
          </section>

          {/* ── Actions ────────────────────────────────────────────── */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-4)" }}>
            <Button variant="secondary" onClick={() => toast("Changes discarded")}>Discard Changes</Button>
            <Button variant="primary" onClick={handleSave}>Save Settings</Button>
          </div>

        </div>
      </div>
    </PageContainer>
  )
}
