import { Navigate, Route, Routes } from "react-router-dom";
import { StudioAuthProvider } from "./auth";
import { RequireAdmin } from "./RequireAdmin";
import { StudioLayout } from "./StudioLayout";
import Login from "./pages/Login";
import Activation from "./pages/Activation";
import Dashboard from "./pages/Dashboard";
import "./studio.css";

export default function StudioApp() {
  return (
    <StudioAuthProvider>
      <Routes>
        <Route path="connexion" element={<Login />} />
        <Route path="activation" element={<Activation />} />
        <Route element={<RequireAdmin><StudioLayout /></RequireAdmin>}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/studio" replace />} />
      </Routes>
    </StudioAuthProvider>
  );
}
