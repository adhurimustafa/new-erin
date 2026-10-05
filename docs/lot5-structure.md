# Lot 5 — Structure recommandée (bilan)

## Fonctionnement
- Source : une version validée du brief + métadonnées des fichiers prêts du projet (jamais leur contenu). Règles fixes (`rules.ts`, version 1), sans IA.
- Restaurant et Artisan/BTP : règles détaillées ; Immobilier, Hôtel, Barber/Beauté, Fitness, Services pro, E-commerce : règles courtes ; Commerce local, Association, Autre : socle commun.
- Réponses lues en trois états : oui / non / non renseigné (« À définir » = non renseigné). Un état inconnu ne crée pas de section : il est listé dans les informations manquantes.
- Réservation, commande, formulaires, paiement : présentés comme « à prévoir, non opérationnels ». Aucune intégration.
- Une catégorie remplie = disponibilité possible, à vérifier ; aucune photo n’est attribuée à une section.
- CTA : seulement parmi les actions compatibles avec les réponses et coordonnées ; sinon « Action à définir ».

## Historique
- Chaque proposition garde la version du brief, la version des règles, le relevé des fichiers (identifiants, libellés, catégories, type, taille) et une empreinte. Changement de fichiers ou nouveau brief : simple avertissement, jamais de recalcul automatique.
- Recalcul : si un brouillon existe, confirmation ; il est archivé (lecture seule, ajustements conservés) et la nouvelle proposition créée dans la même transaction.
- Validée ou archivée : non modifiable, même par appel direct.

## Tests réalisés (projets de test séparés, supprimés ensuite)
- Règles : différences Restaurant/Artisan/Autre ; livraison « Non » vs « À définir » vs « À emporter » ; avant/après oui/non ; certifications vides non affichées ; CTA impossible remplacé ou « à définir ».
- Serveur : brief brouillon refusé, insertion directe refusée, format invalide, relevé de fichiers incohérent, second brouillon, ajustements hors périmètre (section essentielle masquée, page/section ajoutée, CTA incompatible, clé en trop, calcul/relevé/brief modifiés, archivage direct), remplacement d’un fichier à compteur égal détecté, nouvelle version du brief sans effet, échec contrôlé du recalcul (brouillon ajusté intact) puis nouvelle tentative réussie, validée figée.
- Permissions : anonyme, compte sans rôle admin, autre administrateur → rien visible, rien modifiable.
- Navigateur : générer, ajuster, enregistrer, recharger, recalculer (confirmation + archivage), valider, recalculer après validation ; 360/390/768/1440 sans débordement ; aucune erreur console ; vitrine inchangée.

## Limites
- **Limite acceptée (à réévaluer avant toute génération ou publication) :** la proposition est calculée dans le navigateur puis contrôlée par le serveur (accès, format, références de fichiers, périmètre des ajustements) ; le serveur ne recalcule pas les règles métier lui-même et ne garantit donc pas que la proposition initiale correspond exactement aux règles de `rules.ts`. Acceptée pour la recommandation interne ; à réévaluer avant toute génération de site ou publication fondée sur cette structure.
- Studio en français uniquement ; pas de récupération de mot de passe.

## Avertissements du contrôle du code (lint)
11 avertissements, 0 erreur. Tous relèvent de la même règle `react-refresh/only-export-components` (un fichier exporte un composant et une constante/fonction : seul le rechargement à chaud en développement est concerné, aucun défaut fonctionnel).
- Antérieurs au Lot 5 (10) : `src/components/ui/badge.tsx`, `button.tsx`, `form.tsx`, `navigation-menu.tsx`, `sidebar.tsx`, `sonner.tsx`, `toggle.tsx`, `src/i18n.tsx` (2), `src/studio/auth.tsx`, `src/studio/brief/BriefProgress.tsx`.
- Introduits par le Lot 5 : **aucun** (les fichiers `src/studio/structure/*` ne génèrent aucun avertissement).
- Aucun nettoyage ni refonte lancé sur ces points.
- Note : les « deux avertissements » du bilan Lot 4 concernaient le **scan de sécurité** (fonctions de rôle security definer, liste d'autorisation admin fermée — choix assumés), pas le lint ; les deux comptages coexistent sans contradiction.
