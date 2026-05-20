import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"
import { HomePage } from "@/pages/HomePage"
import { PermitsPage } from "@/pages/PermitsPage"
import { ComponentsPage } from "@/pages/ComponentsPage"
import { ColorsPage } from "@/pages/ColorsPage"
import { SettingsPage } from "@/pages/SettingsPage"
import { UserProfilePage } from "@/pages/UserProfilePage"

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* AppShell provides the layout (Header, Footer, Toast) to all child routes */}
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/permits" element={<PermitsPage />} />
          <Route path="/components" element={<ComponentsPage />} />
          <Route path="/colors" element={<ColorsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
