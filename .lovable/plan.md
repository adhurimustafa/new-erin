# Lot 5 — Recommandation de structure du futur site (plan, non implémenté)

## 1. Existant réutilisé
- Données : `project_briefs` (versions validées immuables, `data` jsonb, `sector`, `schema_version`), `brief_asset_refs` (snapshots figés), `project_assets` (catégorie, type vérifié, statut).
- Config déclarative du brief (`src/studio/brief/config.ts`) : clés de champs, importance Obligatoire/Important/Facultatif, `missingFields`, `displayValue`.
- Protections : `has_role` + `owner_id = auth.uid()`, RLS « admin propriétaire », triggers de gel (`guard_project_brief`), isolation par projet.
- UI : fiche projet (sections Brief / Médiathèque), badges, états vides, confirmations, toasts, styles `.brief-*`.

## 2. Règles (moteur pur, côté code, sans IA)
Un fichier de règles par secteur : liste de pages → sections ordonnées, chacune avec `niveau` (essentiel / facultatif), `raison` courte, `conditions` (réponses du brief) et `besoins` (champs ou catégories d’assets).

Restaurant :
- Accueil : hero + CTA (réserver / appeler / commander selon `restaurant_booking`, `delivery`, `primary_cta`), spécialités (si `specialties`), horaires + adresse (essentiel).
- Menu : essentiel si `menu` = complet/partiel ; si « Pas encore » → page maintenue mais marquée « contenu à préparer ».
- Réservation : seulement si réservation en ligne/téléphone ; Livraison/à emporter : section si `delivery` ≠ Non.
- Galerie : facultatif ; état « photos présentes dans la médiathèque : N » (catégorie Photos), sans affecter une photo à une section.
- Contact / Accès : essentiel.

Artisan / BTP :
- Accueil : hero (métiers, zone), CTA devis selon `quote_process`.
- Prestations : essentiel (depuis `trades`/`services`).
- Réalisations : essentiel si `past_projects` ou assets catégorie Réalisations ; avant/après si `before_after` = oui.
- Zone d’intervention : essentiel.
- Certifications : affichée uniquement si renseignées par le client ; sinon jamais proposée comme contenu, seulement « non renseigné ».
- Devis / Contact : essentiel.

Autres secteurs : règles courtes dérivées de leurs champs existants (ex. Immobilier → Biens, Visites ; Hôtel → Chambres, Réservation, Alentours ; Salon → Prestations & tarifs, Rendez-vous) ; « Autre » → socle commun (Accueil, Services, À propos, Contact).

Transverses : langues → sélecteur de langue recommandé si > 1 langue ; `main_goal` et `primary_cta` déterminent le CTA principal ; FAQ et À propos facultatifs. Aucun avis, chiffre, certification ou prestation n’est jamais ajouté.

Informations manquantes : liste par page (champ du brief absent, catégorie d’asset absente). Jamais bloquant, sauf si le brief n’est pas validé.

## 3. Parcours
Fiche projet → section « Structure recommandée » (brief validé requis) :
- « Générer la proposition » (choix de la version validée, la plus récente par défaut).
- Consulter : pages, sections ordonnées, essentiel/facultatif, raison, CTA, contenus à préparer ; bloc séparé « Assets aujourd’hui ».
- Ajuster : masquer/réafficher une section facultative, réordonner sections et pages, renommer une page, changer le CTA parmi les options du brief.
- « Valider la structure » → figée. « Recalculer » → crée une nouvelle proposition.

## 4. Stockage minimal
Table `site_structures` : `owner_id`, `project_id`, `brief_id` (version exacte), `version`, `status` (draft/validated), `rules_version`, `structure` jsonb (résultat + ajustements), `assets_snapshot` jsonb (compteurs par catégorie au moment du calcul), dates.
- RLS admin propriétaire ; trigger : brief lié = même projet et statut validé ; proposition validée immuable ; un seul brouillon par projet.
- Recalcul : jamais d’écrasement. Une nouvelle proposition est créée ; l’ancienne reste consultable. Si le brief ou les assets ont changé depuis, l’interface signale « basée sur brief v1 — v2 disponible » / « assets modifiés depuis ».
- Suppression de projet : propositions supprimées avec lui (comme les briefs).

## 5. Tests ciblés
- Restaurant vs Artisan : pages différentes ; réponses qui modifient la sortie (menu absent, livraison oui/non, devis par téléphone, certifications vides).
- Brief minimal : proposition produite + manquants listés, rien d’inventé.
- Permissions : anon, compte non admin, autre propriétaire, brief d’un autre projet, brief brouillon, modification d’une proposition validée → refusés (appels directs).
- Versions : nouvelle version de brief et ajout/suppression d’asset n’altèrent pas une proposition existante.
- Build, lint, responsive 360–1440, vitrine inchangée ; projets de test séparés, BOcalillo intact, nettoyage final.

## 6. Décisions à valider
1. Ajustements autorisés limités à : masquer facultatifs, réordonner, renommer pages, choisir le CTA (pas d’ajout libre de sections) — ou autoriser l’ajout d’une section libre ?
2. Une proposition peut-elle être recalculée sur un brief non validé (aperçu non enregistré) ou uniquement sur brief validé ?
3. Profondeur des règles pour les secteurs autres que Restaurant/Artisan : règles courtes dans ce lot (proposé), ou socle commun seulement ?
