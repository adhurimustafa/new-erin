// Declarative brief definition. Adding a sector or a question only requires editing this file:
// answers are stored as a flexible JSON object keyed by field key (see project_briefs.data).

export type Importance = "required" | "important" | "optional";
export type FieldType = "text" | "textarea" | "select" | "multi" | "availability";
export type BriefValue = string | string[];
export type BriefData = Record<string, BriefValue>;

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  importance: Importance;
  help?: string;
  placeholder?: string;
  options?: Record<string, string>;
  /** Only shown for these sectors. Omitted = every sector. */
  sectors?: string[];
}

export interface Step { id: string; title: string; intro: string; fields: Field[] }

const yesNo = { yes: "Oui", no: "Non", unsure: "À définir" };
const booking = { none: "Pas de réservation en ligne", phone: "Par téléphone uniquement", form: "Demande via formulaire", external: "Outil externe existant", unsure: "À définir" };
const availability = { available: "Disponible", to_produce: "À produire", none: "Pas nécessaire" };

const HOURS_SECTORS = ["restaurant", "barber_salon", "beauty", "fitness", "local_shop", "hotel", "artisan", "professional_services", "association", "other"];
const SALON = ["barber_salon", "beauty"];

export const STEPS: Step[] = [
  {
    id: "business", title: "Entreprise", intro: "Informations de base. Les données déjà connues dans la fiche client sont préremplies.",
    fields: [
      { key: "business_name", label: "Nom commercial", type: "text", importance: "required" },
      { key: "description", label: "Description de l’activité", type: "textarea", importance: "important", placeholder: "Ce que fait l’entreprise, en quelques phrases." },
      { key: "location", label: "Adresse / localisation", type: "text", importance: "important" },
      { key: "service_area", label: "Zone desservie", type: "text", importance: "optional", placeholder: "Ex. Prishtinë et environs, tout le Kosovo, à distance…" },
      { key: "phone", label: "Téléphone", type: "text", importance: "important" },
      { key: "email", label: "Email", type: "text", importance: "important" },
      { key: "hours", label: "Horaires", type: "textarea", importance: "important", sectors: HOURS_SECTORS, placeholder: "Ex. Lun–Ven 9h–18h" },
      { key: "socials", label: "Réseaux sociaux", type: "textarea", importance: "optional", placeholder: "Un lien par ligne" },
      { key: "existing_website", label: "Site existant", type: "text", importance: "optional", placeholder: "https://" },
    ],
  },
  {
    id: "goal", title: "Objectif", intro: "Ce que le site doit accomplir en priorité.",
    fields: [
      { key: "main_goal", label: "Objectif principal du site", type: "select", importance: "required", options: {
        leads: "Obtenir des demandes de contact / devis", bookings: "Obtenir des réservations", visits: "Faire venir des clients sur place",
        showcase: "Présenter l’activité et inspirer confiance", sales: "Vendre en ligne (futur)", info: "Informer une communauté", other: "Autre" } },
      { key: "main_goal_detail", label: "Précisions sur l’objectif", type: "textarea", importance: "optional" },
      { key: "primary_cta", label: "Action principale souhaitée (CTA)", type: "select", importance: "important", options: {
        call: "Appeler", quote: "Demander un devis", book: "Réserver", contact: "Envoyer un message", visit: "Venir sur place / itinéraire", order: "Commander", whatsapp: "Écrire sur WhatsApp", other: "Autre" } },
      { key: "features", label: "Fonctionnalités souhaitées", type: "multi", importance: "optional", options: {
        contact_form: "Formulaire de contact", quote_form: "Demande de devis", booking: "Réservation / rendez-vous", map: "Carte / itinéraire",
        gallery: "Galerie", video: "Vidéo", faq: "FAQ", testimonials: "Avis clients (réels uniquement)", blog: "Actualités / blog", newsletter: "Newsletter", catalogue: "Catalogue" } },
      { key: "languages", label: "Langues du site", type: "multi", importance: "important", options: { sq: "Albanais", fr: "Français", en: "Anglais", de: "Allemand", it: "Italien", sr: "Serbe", tr: "Turc", es: "Espagnol" } },
    ],
  },
  {
    id: "offer", title: "Offre", intro: "Les questions de cette étape dépendent du secteur choisi.",
    fields: [
      { key: "services", label: "Services ou produits principaux", type: "textarea", importance: "important", placeholder: "Un par ligne" },
      // Restaurant
      { key: "cuisine", label: "Type de cuisine", type: "text", importance: "important", sectors: ["restaurant"] },
      { key: "specialties", label: "Spécialités / plats vedettes", type: "textarea", importance: "optional", sectors: ["restaurant"] },
      { key: "menu", label: "Menu disponible", type: "select", importance: "important", sectors: ["restaurant"], options: { full: "Menu complet disponible", partial: "Menu partiel", none: "Pas encore", unsure: "À définir" } },
      { key: "restaurant_booking", label: "Réservation", type: "select", importance: "important", sectors: ["restaurant"], options: booking },
      { key: "delivery", label: "Livraison / à emporter", type: "select", importance: "optional", sectors: ["restaurant"], options: { none: "Non", takeaway: "À emporter", delivery: "Livraison", both: "Les deux", platforms: "Via plateformes", unsure: "À définir" } },
      { key: "price_range", label: "Gamme de prix", type: "select", importance: "optional", sectors: ["restaurant"], options: { low: "€ — accessible", mid: "€€ — intermédiaire", high: "€€€ — haut de gamme" } },
      // Real estate
      { key: "agency_type", label: "Type d’activité", type: "select", importance: "important", sectors: ["real_estate"], options: { agency: "Agence", developer: "Promoteur", independent: "Agent indépendant", rental: "Gestion locative", other: "Autre" } },
      { key: "property_types", label: "Types de biens", type: "multi", importance: "important", sectors: ["real_estate"], options: { apartment: "Appartements", house: "Maisons", land: "Terrains", commercial: "Locaux commerciaux", office: "Bureaux", new_build: "Programmes neufs" } },
      { key: "transaction_types", label: "Transactions", type: "multi", importance: "important", sectors: ["real_estate"], options: { sale: "Vente", rent: "Location", short_rent: "Location courte durée" } },
      { key: "zones", label: "Zones couvertes", type: "text", importance: "important", sectors: ["real_estate"] },
      { key: "property_features", label: "Caractéristiques à afficher sur les fiches", type: "textarea", importance: "optional", sectors: ["real_estate"], placeholder: "Surface, chambres, étage, parking…" },
      { key: "agents", label: "Agents à présenter", type: "textarea", importance: "optional", sectors: ["real_estate"] },
      { key: "visit_requests", label: "Demandes de visite", type: "select", importance: "important", sectors: ["real_estate"], options: booking },
      // Salon / beauty
      { key: "services_prices", label: "Prestations et tarifs", type: "textarea", importance: "important", sectors: SALON, placeholder: "Prestation — prix (uniquement tarifs confirmés)" },
      { key: "team", label: "Équipe à présenter", type: "textarea", importance: "optional", sectors: [...SALON, "fitness"] },
      { key: "salon_booking", label: "Prise de rendez-vous", type: "select", importance: "important", sectors: [...SALON, "fitness"], options: booking },
      { key: "portfolio", label: "Portfolio de réalisations", type: "select", importance: "optional", sectors: SALON, options: yesNo },
      // Hotel
      { key: "room_types", label: "Types de chambres / logements", type: "textarea", importance: "important", sectors: ["hotel"] },
      { key: "amenities", label: "Équipements", type: "multi", importance: "optional", sectors: ["hotel"], options: { wifi: "Wi-Fi", parking: "Parking", breakfast: "Petit-déjeuner", restaurant: "Restaurant", pool: "Piscine", spa: "Spa", ac: "Climatisation", pets: "Animaux acceptés" } },
      { key: "hotel_services", label: "Services proposés", type: "textarea", importance: "optional", sectors: ["hotel"] },
      { key: "hotel_booking", label: "Réservation", type: "select", importance: "important", sectors: ["hotel"], options: { ...booking, ota: "Plateformes (Booking, Airbnb…)" } },
      { key: "nearby", label: "Activités / lieux à proximité", type: "textarea", importance: "optional", sectors: ["hotel"] },
      // Artisan / BTP
      { key: "trades", label: "Métiers", type: "text", importance: "important", sectors: ["artisan"], placeholder: "Ex. maçonnerie, électricité, rénovation" },
      { key: "intervention_zone", label: "Zone d’intervention", type: "text", importance: "important", sectors: ["artisan"] },
      { key: "past_projects", label: "Réalisations à présenter", type: "textarea", importance: "optional", sectors: ["artisan", "professional_services"] },
      { key: "certifications", label: "Certifications / assurances", type: "textarea", importance: "optional", sectors: ["artisan"], help: "Uniquement celles confirmées par le client, avec justificatif." },
      { key: "quote_process", label: "Demande de devis", type: "select", importance: "important", sectors: ["artisan"], options: { form: "Formulaire en ligne", phone: "Téléphone", visit: "Visite sur place", unsure: "À définir" } },
      { key: "before_after", label: "Photos avant / après", type: "select", importance: "optional", sectors: ["artisan", ...SALON], options: yesNo },
      // Professional services
      { key: "expertise", label: "Domaine d’expertise", type: "textarea", importance: "important", sectors: ["professional_services"] },
      { key: "method", label: "Méthode de travail", type: "textarea", importance: "optional", sectors: ["professional_services"] },
      { key: "appointment", label: "Prise de contact", type: "select", importance: "important", sectors: ["professional_services"], options: { appointment: "Rendez-vous", quote: "Devis", call: "Appel découverte", unsure: "À définir" } },
      { key: "references", label: "Références clients (confirmées)", type: "textarea", importance: "optional", sectors: ["professional_services"] },
      // E-commerce (brief only — store not built)
      { key: "product_categories", label: "Catégories de produits", type: "textarea", importance: "important", sectors: ["ecommerce"] },
      { key: "catalog_size", label: "Taille du catalogue", type: "select", importance: "important", sectors: ["ecommerce"], options: { xs: "Moins de 20 produits", s: "20 à 100", m: "100 à 500", l: "Plus de 500", unsure: "À définir" } },
      { key: "delivery_zones", label: "Zones de livraison", type: "text", importance: "important", sectors: ["ecommerce"] },
      { key: "payment", label: "Moyens de paiement envisagés", type: "multi", importance: "optional", sectors: ["ecommerce"], options: { card: "Carte bancaire", cod: "Paiement à la livraison", transfer: "Virement", unsure: "À définir" } },
      { key: "commercial_goals", label: "Objectifs commerciaux", type: "textarea", importance: "optional", sectors: ["ecommerce"] },
      // Fitness / local shop / association / other
      { key: "offer_details", label: "Détails de l’offre", type: "textarea", importance: "optional", sectors: ["fitness", "local_shop", "association", "other"], placeholder: "Cours, abonnements, produits phares, actions…" },
    ],
  },
  {
    id: "audience", title: "Audience", intro: "À qui s’adresse le site.",
    fields: [
      { key: "audience", label: "Clientèle cible", type: "textarea", importance: "important", placeholder: "Ex. familles du quartier, entreprises locales, touristes…" },
      { key: "differentiators", label: "Ce qui distingue l’entreprise", type: "textarea", importance: "optional", help: "Uniquement des éléments confirmés par le client." },
      { key: "competitors", label: "Concurrents ou sites de référence", type: "textarea", importance: "optional" },
    ],
  },
  {
    id: "content", title: "Contenu", intro: "Indiquez ce qui existe déjà. L’envoi réel des fichiers viendra avec la bibliothèque d’assets.",
    fields: [
      { key: "media_logo", label: "Logo", type: "availability", importance: "important", options: availability },
      { key: "media_photos", label: "Photos", type: "availability", importance: "important", options: availability },
      { key: "media_videos", label: "Vidéos", type: "availability", importance: "optional", options: availability },
      { key: "media_menu", label: "Menu (document)", type: "availability", importance: "important", options: availability, sectors: ["restaurant"] },
      { key: "media_plans", label: "Plans des biens", type: "availability", importance: "optional", options: availability, sectors: ["real_estate"] },
      { key: "media_texts", label: "Textes de présentation", type: "availability", importance: "optional", options: availability },
      { key: "media_documents", label: "Documents / PDF", type: "availability", importance: "optional", options: availability },
      { key: "media_notes", label: "Autres contenus disponibles", type: "textarea", importance: "optional" },
    ],
  },
  {
    id: "style", title: "Style", intro: "Direction visuelle souhaitée.",
    fields: [
      { key: "style", label: "Style recherché", type: "multi", importance: "important", options: {
        luxury: "Luxe", editorial: "Éditorial", minimal: "Minimal", modern: "Moderne", cinematic: "Cinématographique", bold: "Audacieux",
        elegant: "Élégant", warm: "Chaleureux", corporate: "Corporate", futuristic: "Futuriste" } },
      { key: "brand_colors", label: "Couleurs de marque", type: "text", importance: "optional" },
      { key: "style_references", label: "Sites ou références appréciés", type: "textarea", importance: "optional" },
      { key: "style_avoid", label: "À éviter", type: "textarea", importance: "optional" },
      { key: "constraints", label: "Informations ou contraintes particulières", type: "textarea", importance: "optional", placeholder: "Délais, obligations légales, préférences…" },
    ],
  },
];

export const visibleFields = (step: Step, sector: string) => step.fields.filter(f => !f.sectors || f.sectors.includes(sector));

export const isFilled = (v: BriefValue | undefined) => Array.isArray(v) ? v.length > 0 : !!v && v.trim() !== "";

export function missingFields(data: BriefData, sector: string, level: Importance | "all" = "all") {
  return STEPS.flatMap((s, i) => visibleFields(s, sector)
    .filter(f => (level === "all" ? f.importance !== "optional" : f.importance === level) && !isFilled(data[f.key]))
    .map(f => ({ ...f, stepIndex: i, stepTitle: s.title })));
}

export function displayValue(f: Field, v: BriefValue | undefined): string | null {
  if (!isFilled(v)) return null;
  if (Array.isArray(v)) return v.map(x => f.options?.[x] ?? x).join(", ");
  return f.options?.[v as string] ?? (v as string);
}
