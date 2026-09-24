import { Navigate, Route, Routes } from "react-router-dom";
import { StudioAuthProvider } from "./auth";
import { RequireAdmin } from "./RequireAdmin";
import { StudioLayout } from "./StudioLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import "./studio.css";

export default function StudioApp() {
  return (
    <StudioAuthProvider>
      <Routes>
        <Route path="connexion" element={<Login />} />
        <Route element={<RequireAdmin><StudioLayout /></RequireAdmin>}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:id" element={<ClientDetail />} />
          <Route path="projets" element={<Projects />} />
          <Route path="projets/:id" element={<ProjectDetail />} />
        </Route>
        <Route path="*" element={<Navigate to="/studio" replace />} />
      </Routes>
    </StudioAuthProvider>
  );
}
