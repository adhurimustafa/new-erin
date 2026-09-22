# Refonte visuelle futuriste de TADAM

## Objectif
Transformer la vitrine existante en expérience premium, lumineuse et crédible, centrée sur les réalisations réelles, sans modifier les contenus métier, les trois langues, les routes ni le fonctionnement honnête du contact.

## Direction retenue
- Palette verrouillée : nuit `#080B16`, surfaces `#11162A`, violet `#8B5CF6`, bleu `#4F7CFF`, cyan `#38D9F5`, texte `#F5F7FF`, doré du logo en accent limité.
- Poppins pour les titres, Inter pour le texte, typographie plus mesurée et adaptée aux longueurs SQ/FR/EN.
- Profondeur créée par halos diffus localisés, surfaces translucides, bordures colorées subtiles et ombres douces.
- Animations CSS courtes : apparitions au défilement, flottement lent du visuel d’accueil et élévation légère au survol, toutes neutralisées avec `prefers-reduced-motion`.

## Mise en œuvre
1. **En-tête et identité**
   - Afficher le logo complet sans recadrage dans l’en-tête et le footer.
   - Créer un en-tête compact translucide et ajuster précisément le basculement navigation/menu mobile pour éviter tout doublon.
2. **Accueil centré sur les preuves**
   - Remplacer le monogramme par une composition 45/55 avec Glam au premier plan, BRIZIBATIMENT et Ergo Plus en fenêtres secondaires.
   - Utiliser les captures locales authentiques dans des cadres fins, lisibles sans animation.
   - Réduire le titre, ajouter un accent dégradé sur une expression courte propre à chaque langue, garder explication et boutons immédiatement visibles.
3. **Portfolio premium**
   - Recomposer les trois projets clients en cartes généreuses, avec captures correctement cadrées et couleurs préservées.
   - Garder Au Bon Goût dans un bloc secondaire compact et explicitement distinct.
4. **Sections intérieures**
   - Services : trois surfaces translucides avec accents violet, bleu et cyan.
   - Méthode : quatre étapes reliées sur ordinateur et empilées sur mobile.
   - À propos : retirer le bloc AM et construire une présentation éditoriale inspirée du logo, sans faux portrait.
   - FAQ, contact et footer : alléger les titres, soigner les états ouverts, remplacer l’aplat doré par une ambiance nuit violette/cyan et assurer une continuité visuelle jusqu’au bas de page.
5. **Interactions et accessibilité**
   - Harmoniser boutons principal/secondaire et leurs états hover, focus, active et disabled.
   - Préserver navigation clavier, focus du menu, contrastes, zones tactiles, langue active et réduction des animations.
6. **Contrôles**
   - Vérifier visuellement l’accueil et le portfolio à 360, 390, 768 et 1440 px dans SQ/FR/EN.
   - Confirmer absence de débordement, logo complet, menu non dupliqué, routes/liens/choix de langue inchangés.
   - Exécuter lint et build avec les scripts disponibles.
   - Produire les captures ordinateur et téléphone demandées, sans publier.

## Limites conservées
- Le formulaire reste masqué tant qu’aucun envoi serveur fiable n’est configuré ; le lien email direct reste le seul parcours public.
- Aucun prix, ancien délai, faux témoignage, statistique ou nouveau service IA ne sera ajouté.
