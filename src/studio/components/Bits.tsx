import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { STATUSES, SECTORS, formatDate, type ProjectWithClient, type ProjectStatus } from "../data";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <span className={`studio-badge status-${status}`}>{STATUSES[status]}</span>;
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return <div className="studio-empty"><p className="studio-empty-title">{title}</p><p className="studio-muted">{text}</p>{action}</div>;
}

export function Loading() { return <p className="studio-muted" role="status">Chargement…</p>; }
export function ErrorLine({ error }: { error: unknown }) {
  return <p className="studio-error" role="alert">{error instanceof Error ? error.message : "Erreur de chargement."}</p>;
}

export function ProjectList({ projects, showClient = true }: { projects: ProjectWithClient[]; showClient?: boolean }) {
  return (
    <ul className="studio-list">
      {projects.map(p => (
        <li key={p.id}>
          <Link to={`/studio/projets/${p.id}`} className="studio-row">
            <span className="studio-row-main">
              <span className="studio-row-title">{p.name}</span>
              <span className="studio-row-meta">{showClient && p.clients && <>{p.clients.company_name} · </>}{SECTORS[p.sector] ?? p.sector} · modifié le {formatDate(p.updated_at)}</span>
            </span>
            <StatusBadge status={p.status} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
