import { useState } from "react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

/** Deletion requires typing the exact name, to avoid accidental removal. */
export function ConfirmDelete({ name, label, blockedReason, busy, onConfirm }: { name: string; label: string; blockedReason?: string; busy: boolean; onConfirm: () => void }) {
  const [typed, setTyped] = useState("");
  return (
    <AlertDialog onOpenChange={() => setTyped("")}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="studio-danger-btn"><Trash2 aria-hidden="true" />Supprimer</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer {label} ?</AlertDialogTitle>
          <AlertDialogDescription>{blockedReason ?? "Cette action est définitive."}</AlertDialogDescription>
        </AlertDialogHeader>
        {!blockedReason && (
          <div className="studio-field">
            <Label htmlFor="confirm-name">Tapez « {name} » pour confirmer</Label>
            <Input id="confirm-name" value={typed} onChange={e => setTyped(e.target.value)} autoComplete="off" />
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>{blockedReason ? "Fermer" : "Annuler"}</AlertDialogCancel>
          {!blockedReason && <Button variant="destructive" disabled={busy || typed.trim() !== name.trim()} onClick={onConfirm}>{busy ? "Suppression…" : "Supprimer définitivement"}</Button>}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
