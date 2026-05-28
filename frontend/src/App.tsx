import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/hooks/useAuth"
import { AppShell } from "@/components/layout/AppShell"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { HomePage } from "@/pages/HomePage"
import { PermitsPage } from "@/pages/PermitsPage"
import { ComponentsPage } from "@/pages/ComponentsPage"
import { ColorsPage } from "@/pages/ColorsPage"
import { SettingsPage } from "@/pages/SettingsPage"
import { UserProfilePage } from "@/pages/UserProfilePage"
import { LoginPage } from "@/pages/LoginPage"
import { PERMISSIONS } from "@/types/auth"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/permits" element={<PermitsPage />} />
            <Route path="/components" element={<ComponentsPage />} />
            <Route path="/colors" element={<ColorsPage />} />
            <Route
              path="/settings"
              element={
                <ProtectedRoute permission={PERMISSIONS.SETTINGS_ACCESS}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/profile" element={<UserProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
