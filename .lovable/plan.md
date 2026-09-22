# Refonte trilingue de TADAM

## Objectif
Transformer le site actuel en vitrine professionnelle de création de sites internet, avec l’albanais par défaut et une parité complète en français et en anglais. La nouvelle version restera uniquement en aperçu.

## Ce qui sera construit

### 1. Base multilingue maintenable
- Centraliser tous les textes SQ / FR / EN dans une structure typée unique.
- Ajouter un contexte de langue mémorisé dans le navigateur, avec albanais par défaut.
- Mettre à jour `html lang`, le titre et la description lors du changement de langue.
- Conserver l’ancre consultée et les champs du formulaire lors du changement de langue.
- Traduire aussi les libellés invisibles utiles à l’accessibilité, les erreurs, les pages système et les textes alternatifs.

### 2. Nouvelle page d’accueil
Recomposer la page dans cet ordre :
1. Accueil compact avec le texte fourni, les deux appels à l’action et trois repères.
2. Réalisations : trois projets clients dans une grille, puis Au Bon Goût dans un bloc distinct clairement présenté comme concept commercial sans suite.
3. Services : site vitrine, catalogue sans paiement et boutique en ligne.
4. Méthode en quatre étapes, avec l’unique mention discrète de l’intelligence artificielle.
5. Présentation typographique d’Adhurim Mustafa, sans faux portrait ni équipe inventée.
6. FAQ complète et accessible.
7. Contact.
8. Footer sobre avec les informations confirmées uniquement.

### 3. Direction visuelle
- Appliquer la palette sombre demandée via des variables sémantiques : fond nuit, surfaces bleu-gris, ivoire, texte secondaire et accent doré.
- Conserver et recadrer visuellement le logo existant sans le remplacer.
- Garder Poppins et Inter, supprimer les polices et effets inutiles.
- Retirer les visuels futuristes/IA, halos de texte, longs dégradés multicolores et espaces excessifs.
- Créer une navigation compacte avec menu mobile accessible, fermeture Échap et retour du focus.
- Utiliser des animations courtes et désactivables selon la préférence de mouvement.

### 4. Portfolio vérifiable
- Vérifier les quatre URL indiquées.
- Utiliser des captures récentes lorsque les sites permettent une capture représentative ; sinon afficher une carte textuelle soignée sans inventer d’interface.
- Optimiser les images locales, réserver leurs dimensions et traduire leurs textes alternatifs.
- Sécuriser les liens externes et ne pas utiliser d’iframe ni de carrousel automatique.

### 5. Parcours de demande honnête
- Supprimer les simulations d’envoi, le faux calendrier, les faux créneaux et les confirmations locales.
- Rediriger `/reserver` vers `/#contact` en conservant la langue active.
- Préparer une validation Zod côté client avec limites de longueur et messages localisés.
- N’afficher le formulaire public que si une transmission serveur réellement opérationnelle peut être configurée et testée.
- À défaut, afficher le texte de remplacement fourni et garder le lien email direct.
- Protéger `/merci` : aucun succès ne sera affiché sans preuve de soumission réussie.
- Si l’envoi peut être activé, ajouter validation serveur, destinataire fixe, Reply-To visiteur, anti-doublon, limitation et confirmation uniquement après acceptation du fournisseur.

### 6. Pages et métadonnées
- Créer de vraies pages `/mentions-legales` et `/confidentialite`, trilingues, limitées aux informations confirmées et clairement non finalisées tant que les données légales manquent.
- Refaire `/merci` et la page introuvable dans les trois langues.
- Mettre les métadonnées albanaises de référence directement dans le HTML initial pour les robots sociaux.
- Mettre à jour Open Graph, Twitter, manifest, favicon, canonique et identité TADAM sans anciennes promesses.
- Créer une image de partage typographique à partir du logo existant, sans faux portfolio.
- Documenter la limite des aperçus sociaux FR/EN avec une URL unique côté client.

## Nettoyage
- Retirer partout les packs, prix, promesses 4–8 h / 48–72 h, anciens services IA, coordonnées postales obsolètes, placeholders, réseaux génériques et formulations en « nous » qui suggèrent une équipe.
- Ne pas ajouter d’analytics, traceur, prix, numéro, adresse, certification, témoignage ou résultat non fourni.

## Vérifications
- Exécuter les scripts de build et de lint disponibles.
- Vérifier par navigation automatisée SQ / FR / EN, les ancres, le choix mémorisé, les champs conservés et toutes les routes.
- Contrôler les textes interdits et clés de traduction manquantes dans le code et l’interface rendue.
- Tester les largeurs 360, 390, 768 et 1440 px, le débordement horizontal, le menu clavier, la FAQ et les liens externes.
- Tester les validations et l’échec réseau ; tester le succès, la limitation et la réception uniquement si une transmission serveur est réellement activée.
- Vérifier le HTML initial, puis les métadonnées après chaque changement de langue.
- Fournir un bilan séparant clairement réalisé, testé et bloqué, avec le lien d’aperçu et les informations légales ou accès encore nécessaires.

## Contraintes connues à ce stade
- Le projet ne contient actuellement aucun service serveur de contact : les deux formulaires simulent un succès dans le navigateur.
- Une connexion Gmail est disponible dans l’espace de travail mais n’est pas reliée au projet ; elle ne sera pas activée sans action explicite dans le parcours de connexion. Tant qu’un envoi serveur n’est pas opérationnel, le formulaire restera masqué conformément au brief.
- Les informations juridiques (statut, immatriculation, adresse légale, hébergeur juridique et règles de conservation) ne sont pas confirmées ; les pages légales ne les inventeront pas.
