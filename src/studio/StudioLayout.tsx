import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, FolderKanban, Images, LogOut, ExternalLink } from "lucide-react";
import logo from "@/assets/logo-tadam-header.png";
import { Button } from "@/components/ui/button";
import { useStudioAuth } from "./auth";

const upcoming = [
  { label: "Clients", icon: Users },
  { label: "Projets", icon: FolderKanban },
  { label: "Assets", icon: Images },
];

export function StudioLayout() {
  const { session, signOut } = useStudioAuth();
  return (
    <div className="studio-shell">
      <aside className="studio-sidebar" aria-label="Navigation du Studio">
        <div className="studio-brand"><img src={logo} alt="TADAM" width="905" height="602" /><span>Studio</span></div>
        <nav className="studio-nav">
          <NavLink to="/studio" end className={({ isActive }) => `studio-nav-link${isActive ? " is-active" : ""}`}>
            <LayoutDashboard aria-hidden="true" />Tableau de bord
          </NavLink>
          {upcoming.map(({ label, icon: Icon }) => (
            <span key={label} className="studio-nav-link is-disabled" aria-disabled="true">
              <Icon aria-hidden="true" />{label}<em>Prévu</em>
            </span>
          ))}
        </nav>
        <div className="studio-sidebar-foot">
          <a href="/" className="studio-nav-link"><ExternalLink aria-hidden="true" />Voir le site public</a>
          <p className="studio-account" title={session?.user.email}>{session?.user.email}</p>
          <Button variant="outline" size="sm" onClick={signOut} className="w-full"><LogOut aria-hidden="true" />Se déconnecter</Button>
        </div>
      </aside>
      <main className="studio-main" id="studio-main"><Outlet /></main>
    </div>
  );
}
