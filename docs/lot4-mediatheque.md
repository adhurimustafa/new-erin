# Lot 4 — Médiathèque privée des projets (bilan de clôture)

Validé le 5 octobre 2026. Rien n'est publié ; le Lot 5 n'est pas commencé.

## Modèle de données

- Fichiers réels stockés dans le bucket privé `project-assets`, chemin `owner/project/asset_id`. Les fichiers appartiennent toujours au **projet**, jamais à une version de brief.
- Table `project_assets` : projet, client, propriétaire, libellé, catégorie, type vérifié, taille, emplacement, état (`pending` / `ready` / `deleting` / `removed`), dates.
- Table `brief_asset_refs` : seules les références explicites (cochées dans la médiathèque) lient un brief à un fichier. Les réponses « Disponible / À produire / Pas nécessaire » ne sont pas des références.
- Un brief validé reste immuable : aucune modification rétroactive de ses réponses. Si un fichier référencé est supprimé, seules les métadonnées (nom, catégorie, date de retrait) sont conservées pour afficher « fichier retiré depuis » — aucune copie du fichier.
- Une nouvelle version de brief reprend les références des fichiers encore disponibles en une seule opération transactionnelle serveur (brouillon + références réussissent ensemble ou rien n'est conservé). Aucun fichier n'est dupliqué.

## Validation serveur

- Edge function `studio-assets` : finalize / delete / maintain / delete_project. Fonction `asset_object_info` réservée au service role.
- Type de fichier déterminé côté serveur à partir des premiers octets (signature), jamais depuis l'extension ou le MIME déclaré. Taille réelle contrôlée.
- Limites validées : images 15 Mo, PDF 25 Mo, MP4 200 Mo, 20 fichiers par envoi, 3 envois simultanés. MOV exclu (lecture non fiable hors Safari).
- Un fichier en attente ou refusé est inaccessible, y compris par accès direct au stockage. Le navigateur ne peut ni marquer un fichier « prêt », ni le renommer, ni le remplacer après validation.

## Vérifications réalisées (tests réussis)

- Refus réels : texte en `.png`, PNG de 16 Mo, MOV, fichier > 200 Mo ; MP4 de 30 Mo accepté.
- Sessions réelles : anonyme 401 ; projet d'un autre propriétaire refusé ; fichiers en vérification inaccessibles.
- Nettoyage à l'ouverture de la médiathèque : envois abandonnés > 24 h, reprise des suppressions interrompues.
- Suppression d'un fichier référencé par un brief validé : autorisée avec avertissement, brief inchangé, trace minimale.
- Suppression de projet : bloque les nouveaux uploads, supprime les fichiers stockés, puis les fiches, puis le projet et ses briefs ; bouton « Relancer la suppression » si interrompue.
- Création d'une nouvelle version avec échec simulé : aucun brouillon incomplet, nouvelle tentative réussie, aucune erreur navigateur.
- Responsive 360–1440 sans débordement, vitrine publique inchangée, lint et build OK, données de test supprimées.

## Limites connues (assumées, pas de refonte prévue)

- Le contrôle du contenu ne porte que sur les premiers octets ; un MP4 est vérifié dans son conteneur, pas son codec — lecture non garantie, téléchargement proposé en secours.
- Le lien brief→fichier se fait uniquement depuis la médiathèque, pas depuis le formulaire du brief.
- Le nettoyage des envois abandonnés ne se fait qu'à l'ouverture de la médiathèque (pas de tâche planifiée).
- Si la reprise des liens échoue, un avertissement s'affiche et les références doivent être recochées (l'opération transactionnelle reste la protection principale).
- Hors Lot 4 : récupération de mot de passe inexistante ; Studio uniquement en français.

## Avertissements de contrôle du code restants (volontaires)

- Fonctions de rôle (security definer) signalées par le scan — choix assumé du Lot 1.
- Liste d'autorisation admin fermée signalée par le scan — choix assumé.
- Aucun nettoyage ni refonte lancé sur ces points.
