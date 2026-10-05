// Explicit, sector-based rules that turn a validated brief + ready-file metadata into a recommended site structure.
// No AI, no content generation: every page/section states why it is suggested and what is still needed.
import { type BriefData, type BriefValue, STEPS, isFilled, missingFields } from "../brief/config";
import type { AssetCategory } from "../assets";

export const RULES_VERSION = 1;

export type Section = { id: string; title: string; essential: boolean; reason: string; needs: string[]; future?: boolean };
export type Page = { id: string; title: string; essential: boolean; reason: string; sections: Section[] };
export type CtaOption = { key: string; label: string; compatible: boolean; note: string };
export type Generated = {
  sector: string; pages: Page[]; cta_options: CtaOption[]; cta_default: string; cta_reason: string;
  navigation_note: string; languages: string[]; missing: { label: string; level: string }[];
  to_prepare: string[]; future_features: string[]; asset_notes: string[];
};
export type Adjustments = { page_order: string[]; page_titles: Record<string, string>; section_order: Record<string, string[]>; hidden: string[]; cta: string };
export type AssetMeta = { id: string; category: AssetCategory; label: string };

const LANG: Record<string, string> = { sq: "Albanais", fr: "Français", en: "Anglais", de: "Allemand", it: "Italien", sr: "Serbe", tr: "Turc", es: "Espagnol" };
const CAT: Record<AssetCategory, string> = { logo: "Logo", photos: "Photos", videos: "Vidéos", documents: "Documents", menu_pricing: "Menu / Tarifs", portfolio: "Réalisations", other: "Autre" };

const str = (v: BriefValue | undefined) => (typeof v === "string" ? v.trim() : "");
const list = (v: BriefValue | undefined) => (Array.isArray(v) ? v : []);
const has = (d: BriefData, k: string) => isFilled(d[k]);
/** Tri-state reading of a select answer: explicit yes, explicit no, or unknown (empty / "À définir"). */
function tri(v: BriefValue | undefined, yes: string[], no: string[]): "yes" | "no" | "unknown" {
  const s = str(v);
  if (yes.includes(s)) return "yes";
  if (no.includes(s)) return "no";
  return "unknown";
}
const label = (key: string) => STEPS.flatMap(s => s.fields).find(f => f.key === key)?.label ?? key;
const optLabel = (key: string, v: string) => STEPS.flatMap(s => s.fields).find(f => f.key === key)?.options?.[v] ?? v;

type Ctx = { d: BriefData; sector: string; counts: Partial<Record<AssetCategory, number>>; missing: Generated["missing"]; prep: Set<string>; future: Set<string> };

const sec = (id: string, title: string, essential: boolean, reason: string, needs: string[] = [], future = false): Section => ({ id, title, essential, reason, needs, ...(future ? { future } : {}) });
const need = (c: Ctx, key: string) => (has(c.d, key) ? [] : [`${label(key)} (non renseigné)`]);
const ask = (c: Ctx, text: string, level = "à préciser") => c.missing.push({ label: text, level });
const files = (c: Ctx, cat: AssetCategory) => c.counts[cat] ?? 0;
const fileNote = (c: Ctx, cat: AssetCategory) => files(c, cat)
  ? [`${files(c, cat)} fichier(s) en catégorie « ${CAT[cat]} » : disponibilité possible, contenu à vérifier`]
  : [`Aucun fichier en catégorie « ${CAT[cat]} » pour l’instant`];

/** Booking-like select (booking options in config) → section + note. Unknown answers are never treated as yes. */
function bookingSection(c: Ctx, key: string, title: string): Section | null {
  const v = str(c.d[key]);
  if (v === "form") { c.future.add(`${title} via formulaire — fonctionnalité à prévoir, non opérationnelle`); return sec("booking", title, true, `Le brief prévoit des demandes via formulaire (${label(key)}). À construire plus tard : rien n’est actif aujourd’hui.`, [], true); }
  if (v === "phone") return sec("booking", title, true, "Le brief indique que cela se fait par téléphone : la section renvoie vers l’appel.", need(c, "phone"));
  if (v === "external") return sec("booking", title, true, "Un outil externe existe déjà : la section renverra vers lui.", ["Lien de l’outil externe à fournir"]);
  if (v === "ota") return sec("booking", title, true, "Réservation via plateformes : la section renverra vers elles.", ["Liens des plateformes à fournir"]);
  if (v === "none") return null;
  ask(c, `${label(key)} : mode non précisé (aucune section dédiée proposée)`);
  return null;
}

function commonHome(c: Ctx, extra: Section[]): Page {
  const aud = str(c.d.audience);
  return {
    id: "home", title: "Accueil", essential: true, reason: "Point d’entrée du site : présente l’activité et l’action principale.",
    sections: [
      sec("hero", "En-tête : nom, activité et action principale", true, aud ? `Message orienté vers la clientèle indiquée : « ${aud.slice(0, 80)} ».` : "Présentation immédiate de l’activité.",
        [...need(c, "business_name"), ...need(c, "description"), ...(aud ? [] : ["Clientèle cible (non renseignée)"])]),
      ...extra,
    ],
  };
}

function aboutPage(c: Ctx): Page | null {
  if (!has(c.d, "description") && !has(c.d, "differentiators")) return null;
  return { id: "about", title: "À propos", essential: false, reason: "Le brief contient une description ou des éléments distinctifs confirmés.",
    sections: [sec("story", "Présentation de l’entreprise", false, "Reprend uniquement la description fournie.", need(c, "description")),
      ...(has(c.d, "differentiators") ? [sec("differentiators", "Ce qui distingue l’entreprise", false, "Éléments confirmés par le client dans le brief.")] : [])] };
}

function contactPage(c: Ctx, extra: Section[] = []): Page {
  const sections: Section[] = [...extra,
    sec("details", "Coordonnées", true, "Permet de joindre l’entreprise avec les coordonnées du brief.", [...need(c, "phone"), ...need(c, "email")]),
  ];
  if (has(c.d, "location") || list(c.d.features).includes("map")) sections.push(sec("map", "Adresse et accès", true, "Une adresse est renseignée ou une carte est demandée.", need(c, "location")));
  if (has(c.d, "hours")) sections.push(sec("hours", "Horaires", true, "Horaires renseignés dans le brief."));
  if (list(c.d.features).includes("contact_form")) { c.future.add("Formulaire de contact — à prévoir, aucun envoi actif dans ce lot"); sections.push(sec("form", "Formulaire de contact", false, "Demandé dans les fonctionnalités. À construire plus tard.", [], true)); }
  if (has(c.d, "socials")) sections.push(sec("socials", "Réseaux sociaux", false, "Liens fournis dans le brief."));
  return { id: "contact", title: "Contact", essential: true, reason: "Indispensable pour transformer une visite en prise de contact.", sections };
}

function extras(c: Ctx): Page[] {
  const f = list(c.d.features); const out: Page[] = [];
  if (f.includes("faq")) out.push({ id: "faq", title: "FAQ", essential: false, reason: "FAQ demandée dans les fonctionnalités.", sections: [sec("questions", "Questions fréquentes", false, "Questions et réponses à fournir par le client : aucune n’est rédigée automatiquement.", ["Questions et réponses à fournir"])] });
  out.push({ id: "legal", title: "Mentions légales et confidentialité", essential: true, reason: "Informations légales attendues sur tout site professionnel.", sections: [sec("legal", "Mentions légales et confidentialité", true, "Informations juridiques à fournir par le client.", ["Informations légales à fournir"])] });
  return out;
}

function testimonials(c: Ctx): Section[] {
  if (!list(c.d.features).includes("testimonials")) return [];
  return [sec("reviews", "Avis clients", false, "Demandé dans le brief. Uniquement des avis réels fournis par le client, aucun avis n’est créé.", ["Avis réels à fournir"])];
}

// ---------- Sectors ----------
function restaurant(c: Ctx): Page[] {
  const d = c.d; const homeExtra: Section[] = [];
  homeExtra.push(sec("cuisine", "Cuisine et ambiance", true, has(d, "cuisine") ? `Type de cuisine renseigné : ${str(d.cuisine)}.` : "Présente la cuisine proposée.", need(c, "cuisine")));
  if (has(d, "specialties")) homeExtra.push(sec("specialties", "Spécialités", false, "Spécialités renseignées dans le brief."));
  const dl = str(d.delivery);
  if (["takeaway", "delivery", "both", "platforms"].includes(dl)) {
    homeExtra.push(sec("delivery", optLabel("delivery", dl), true, `Le brief indique explicitement : ${optLabel("delivery", dl)}.`, dl === "platforms" ? ["Liens des plateformes à fournir"] : []));
  } else if (dl !== "none") ask(c, "Livraison / à emporter : non précisé (aucune section proposée)");
  homeExtra.push(sec("practical", "Infos pratiques (horaires, adresse)", true, "Information attendue avant de se déplacer.", [...need(c, "hours"), ...need(c, "location")]));
  homeExtra.push(...testimonials(c));
  const pages: Page[] = [commonHome(c, homeExtra)];

  const menu = tri(d.menu, ["full", "partial"], ["none"]);
  const menuNeeds = [...fileNote(c, "menu_pricing")];
  if (str(d.menu) === "partial") menuNeeds.push("Menu partiel : compléter avant mise en ligne");
  if (menu === "yes") pages.push({ id: "menu", title: "Menu", essential: true, reason: `Menu déclaré : ${optLabel("menu", str(d.menu))}.`, sections: [sec("menu", "Carte et plats", true, "Présente le menu fourni par le client.", menuNeeds), ...(has(d, "price_range") ? [sec("prices", "Gamme de prix", false, `Indiquée dans le brief : ${optLabel("price_range", str(d.price_range))}.`)] : [])] });
  else { pages.push({ id: "menu", title: "Menu", essential: false, reason: menu === "no" ? "Pas encore de menu : page à garder seulement si le menu est préparé." : "Menu non précisé dans le brief.", sections: [sec("menu", "Carte et plats", false, "Contenu à préparer.", ["Menu à fournir", ...menuNeeds])] }); c.prep.add("Menu"); }

  const bk = bookingSection(c, "restaurant_booking", "Réservation");
  if (has(d, "media_photos") || files(c, "photos")) pages.push({ id: "gallery", title: "Galerie", essential: false, reason: "Photos déclarées ou présentes dans la médiathèque.", sections: [sec("photos", "Photos de l’établissement et des plats", false, "Aucune photo n’est attribuée automatiquement à cette section.", fileNote(c, "photos"))] });
  const ab = aboutPage(c); if (ab) pages.push(ab);
  pages.push(contactPage(c, bk ? [bk] : []));
  return pages;
}

function artisan(c: Ctx): Page[] {
  const d = c.d; const home: Section[] = [
    sec("trades", "Métiers et savoir-faire", true, has(d, "trades") ? `Métiers renseignés : ${str(d.trades)}.` : "Présente les métiers exercés.", need(c, "trades")),
    sec("zone", "Zone d’intervention", true, "Le client doit savoir rapidement si l’entreprise intervient chez lui.", need(c, "intervention_zone")),
  ];
  if (has(d, "certifications")) home.push(sec("certifications", "Certifications et assurances", false, "Renseignées dans le brief : justificatifs à vérifier avant affichage.", ["Justificatifs à vérifier"]));
  else ask(c, "Certifications / assurances : aucune renseignée — rien ne sera affiché", "information");
  home.push(...testimonials(c));
  const pages: Page[] = [commonHome(c, home)];
  pages.push({ id: "services", title: "Prestations", essential: true, reason: "Détaille les travaux proposés.", sections: [sec("list", "Liste des prestations", true, "Reprend uniquement les services du brief.", has(d, "services") || has(d, "trades") ? [] : ["Services (non renseignés)"])] });
  const real: Section[] = [sec("projects", "Réalisations", true, has(d, "past_projects") ? "Réalisations décrites dans le brief." : "Réalisations à documenter.", [...(has(d, "past_projects") ? [] : ["Description des réalisations à fournir"]), ...fileNote(c, "portfolio")])];
  const ba = tri(d.before_after, ["yes"], ["no"]);
  if (ba === "yes") real.push(sec("before_after", "Avant / après", false, "Photos avant / après déclarées dans le brief.", ["Paires de photos avant / après à identifier"]));
  else if (ba === "unknown") ask(c, "Photos avant / après : non précisé");
  const realEssential = has(d, "past_projects") || files(c, "portfolio") > 0;
  real[0].essential = realEssential;
  pages.push({ id: "projects", title: "Réalisations", essential: realEssential, reason: realEssential ? "Des réalisations sont décrites ou présentes dans la médiathèque." : "Aucune réalisation fournie pour l’instant : utile si le client en fournit.", sections: real });
  const q = str(d.quote_process); const quote: Section[] = [];
  if (q === "form") { c.future.add("Formulaire de demande de devis — à prévoir, non opérationnel"); quote.push(sec("quote", "Demande de devis (formulaire)", true, "Le brief prévoit un formulaire de devis. À construire plus tard.", [], true)); }
  else if (q === "phone") quote.push(sec("quote", "Demande de devis par téléphone", true, "Le brief indique les devis par téléphone.", need(c, "phone")));
  else if (q === "visit") quote.push(sec("quote", "Demande de visite sur place", true, "Le brief indique un devis après visite.", [...need(c, "phone"), ...need(c, "email")].slice(0, 1)));
  else ask(c, "Demande de devis : mode non précisé");
  pages.push(contactPage(c, quote));
  const ab = aboutPage(c); if (ab) pages.push(ab);
  return pages;
}

function realEstate(c: Ctx): Page[] {
  const d = c.d; const types = list(d.property_types).map(v => optLabel("property_types", v)); const tr = list(d.transaction_types).map(v => optLabel("transaction_types", v));
  const pages: Page[] = [commonHome(c, [sec("zones", "Zones couvertes", true, "Information clé pour un acheteur ou locataire.", need(c, "zones"))])];
  pages.push({ id: "properties", title: "Biens", essential: true, reason: types.length ? `Types de biens : ${types.join(", ")}${tr.length ? ` · ${tr.join(", ")}` : ""}.` : "Présente les biens proposés.", sections: [
    sec("list", "Liste des biens", true, "Biens réels à fournir : aucun n’est créé.", [...(types.length ? [] : ["Types de biens (non renseignés)"]), "Biens à fournir"]),
    sec("detail", "Fiche d’un bien", true, has(d, "property_features") ? "Caractéristiques à afficher indiquées dans le brief." : "Modèle de fiche.", [...need(c, "property_features"), ...fileNote(c, "photos")]),
  ] });
  if (has(d, "agents")) pages.push({ id: "team", title: "Équipe", essential: false, reason: "Agents à présenter indiqués dans le brief.", sections: [sec("agents", "Agents", false, "Uniquement les agents indiqués.")] });
  const v = bookingSection(c, "visit_requests", "Demande de visite");
  pages.push(contactPage(c, v ? [v] : []));
  return pages;
}

function hotel(c: Ctx): Page[] {
  const d = c.d; const pages: Page[] = [commonHome(c, [sec("location", "Localisation", true, "Critère essentiel pour un séjour.", need(c, "location"))])];
  const rooms: Section[] = [sec("rooms", "Types de chambres / logements", true, "Présente l’offre d’hébergement.", [...need(c, "room_types"), ...fileNote(c, "photos")])];
  if (list(d.amenities).length) rooms.push(sec("amenities", "Équipements", false, `Équipements cochés : ${list(d.amenities).map(a => optLabel("amenities", a)).join(", ")}.`));
  if (has(d, "hotel_services")) rooms.push(sec("services", "Services", false, "Services renseignés dans le brief."));
  pages.push({ id: "rooms", title: "Chambres", essential: true, reason: "Cœur de l’offre.", sections: rooms });
  if (has(d, "nearby")) pages.push({ id: "nearby", title: "Alentours", essential: false, reason: "Activités à proximité renseignées.", sections: [sec("nearby", "À proximité", false, "Reprend les lieux indiqués.")] });
  const b = bookingSection(c, "hotel_booking", "Réservation");
  pages.push(contactPage(c, b ? [b] : []));
  return pages;
}

function salon(c: Ctx, fitness = false): Page[] {
  const d = c.d; const pages: Page[] = [commonHome(c, testimonials(c))];
  if (fitness) pages.push({ id: "offer", title: "Offre", essential: true, reason: "Présente cours, abonnements ou services.", sections: [sec("offer", "Cours et abonnements", true, "Reprend l’offre du brief.", has(d, "offer_details") || has(d, "services") ? [] : ["Détails de l’offre (non renseignés)"])] });
  else pages.push({ id: "services", title: "Prestations et tarifs", essential: true, reason: "Information la plus recherchée.", sections: [sec("prices", "Prestations et tarifs", true, "Uniquement les tarifs confirmés dans le brief.", [...need(c, "services_prices"), ...fileNote(c, "menu_pricing")])] });
  if (has(d, "team")) pages.push({ id: "team", title: "Équipe", essential: false, reason: "Équipe à présenter indiquée.", sections: [sec("team", "Équipe", false, "Uniquement les personnes indiquées.")] });
  if (!fitness) {
    const pf = tri(d.portfolio, ["yes"], ["no"]); const ba = tri(d.before_after, ["yes"], ["no"]);
    const s: Section[] = [];
    if (pf === "yes" || files(c, "portfolio")) s.push(sec("portfolio", "Portfolio", false, pf === "yes" ? "Portfolio déclaré dans le brief." : "Fichiers présents en catégorie Réalisations.", fileNote(c, "portfolio")));
    if (ba === "yes") s.push(sec("before_after", "Avant / après", false, "Déclaré dans le brief.", ["Paires de photos à identifier"]));
    if (pf === "unknown") ask(c, "Portfolio : non précisé");
    if (ba === "unknown") ask(c, "Photos avant / après : non précisé");
    if (s.length) pages.push({ id: "portfolio", title: "Réalisations", essential: false, reason: "Montre le travail réalisé.", sections: s });
  }
  const b = bookingSection(c, "salon_booking", fitness ? "Inscription / rendez-vous" : "Prise de rendez-vous");
  pages.push(contactPage(c, b ? [b] : []));
  return pages;
}

function professional(c: Ctx): Page[] {
  const d = c.d; const pages: Page[] = [commonHome(c, [sec("expertise", "Domaine d’expertise", true, "Établit la crédibilité à partir des éléments du brief.", need(c, "expertise"))])];
  pages.push({ id: "services", title: "Services", essential: true, reason: "Détaille l’offre.", sections: [sec("list", "Services", true, "Reprend uniquement les services du brief.", need(c, "services")), ...(has(d, "method") ? [sec("method", "Méthode de travail", false, "Méthode décrite dans le brief.")] : [])] });
  const refs: Section[] = [];
  if (has(d, "references")) refs.push(sec("references", "Références clients", false, "Références confirmées dans le brief.", ["Accord des clients cités à vérifier"]));
  if (has(d, "past_projects")) refs.push(sec("projects", "Réalisations", false, "Réalisations décrites dans le brief."));
  if (refs.length) pages.push({ id: "references", title: "Références", essential: false, reason: "Éléments de preuve fournis par le client.", sections: refs });
  const a = str(d.appointment); const s: Section[] = [];
  if (a === "appointment" || a === "call") { c.future.add("Prise de rendez-vous en ligne — à prévoir si souhaitée, non opérationnelle"); s.push(sec("appointment", optLabel("appointment", a), true, "Mode de contact indiqué dans le brief.", need(c, "phone"))); }
  else if (a === "quote") s.push(sec("appointment", "Demande de devis", true, "Mode de contact indiqué dans le brief.", need(c, "email")));
  else ask(c, "Prise de contact : mode non précisé");
  pages.push(contactPage(c, s));
  return pages;
}

function ecommerce(c: Ctx): Page[] {
  const d = c.d; c.future.add("Boutique en ligne (panier, commande, paiement) — non construite dans ce lot");
  const pages: Page[] = [commonHome(c, [])];
  pages.push({ id: "catalog", title: "Catalogue", essential: true, reason: has(d, "catalog_size") ? `Taille indiquée : ${optLabel("catalog_size", str(d.catalog_size))}.` : "Présente les catégories de produits.", sections: [sec("categories", "Catégories de produits", true, "Reprend les catégories du brief, sans créer de produit.", [...need(c, "product_categories"), "Produits à fournir"])] });
  pages.push({ id: "shipping", title: "Livraison et paiement", essential: true, reason: "Informations attendues avant un achat.", sections: [
    sec("zones", "Zones de livraison", true, "Indiquées dans le brief.", need(c, "delivery_zones")),
    sec("payment", "Moyens de paiement envisagés", false, "Information seulement : aucun paiement n’est intégré.", need(c, "payment"), true),
  ] });
  pages.push(contactPage(c));
  return pages;
}

function base(c: Ctx): Page[] {
  return [commonHome(c, testimonials(c)),
    { id: "services", title: "Services / offre", essential: true, reason: "Présente ce que propose l’entreprise.", sections: [sec("list", "Offre", true, "Reprend uniquement les éléments du brief.", has(c.d, "services") || has(c.d, "offer_details") ? [] : ["Services ou offre (non renseignés)"])] },
    ...(aboutPage(c) ? [aboutPage(c)!] : []), contactPage(c)];
}

// ---------- CTA ----------
function ctaOptions(c: Ctx): { options: CtaOption[]; def: string; reason: string } {
  const d = c.d; const phone = has(d, "phone"), email = has(d, "email"), loc = has(d, "location");
  const book = str(d.restaurant_booking || d.hotel_booking || d.salon_booking || d.visit_requests);
  const all: CtaOption[] = [
    { key: "call", label: "Appeler", compatible: phone, note: phone ? "Téléphone renseigné." : "Téléphone non renseigné." },
    { key: "whatsapp", label: "Écrire sur WhatsApp", compatible: phone, note: phone ? "Numéro à confirmer comme compte WhatsApp." : "Téléphone non renseigné." },
    { key: "contact", label: "Envoyer un message", compatible: email, note: email ? "Par email (formulaire éventuel à prévoir)." : "Email non renseigné." },
    { key: "visit", label: "Venir sur place / itinéraire", compatible: loc, note: loc ? "Adresse renseignée." : "Adresse non renseignée." },
    { key: "quote", label: "Demander un devis", compatible: phone || email, note: "Par téléphone ou email ; formulaire éventuel à prévoir." },
    { key: "book", label: "Réserver", compatible: (book === "phone" && phone) || book === "form" || book === "external" || book === "ota",
      note: book === "form" ? "Demande de réservation à prévoir (non opérationnelle)." : book === "phone" ? "Par téléphone." : book === "external" || book === "ota" ? "Lien vers l’outil existant à fournir." : "Mode de réservation non précisé." },
    { key: "order", label: "Commander", compatible: false, note: "Commande en ligne non disponible : fonctionnalité future." },
  ];
  const wanted = str(d.primary_cta);
  const goalMap: Record<string, string[]> = { leads: ["quote", "contact", "call"], bookings: ["book", "call"], visits: ["visit", "call"], showcase: ["contact", "call"], sales: ["contact", "call"], info: ["contact"], other: ["contact", "call"] };
  const w = all.find(o => o.key === wanted);
  if (w?.compatible) return { options: all, def: w.key, reason: `Action choisie dans le brief : « ${w.label} ».` };
  const fb = [...(goalMap[str(d.main_goal)] ?? []), "call", "contact", "visit", "quote"].map(k => all.find(o => o.key === k)!).find(o => o?.compatible);
  if (wanted === "order") c.future.add("Commande en ligne — fonctionnalité à prévoir, non opérationnelle");
  if (!fb) {
    ask(c, "Aucune coordonnée ne permet d’action principale : téléphone, email ou adresse à fournir", "important");
    const opt = { key: "pending", label: "Action à définir", compatible: true, note: "En attente de coordonnées." };
    return { options: [...all, opt], def: "pending", reason: "Aucune action n’est possible avec les coordonnées actuelles." };
  }
  return { options: all, def: fb.key, reason: w ? `« ${w.label} » demandé mais pas possible en l’état (${w.note}) : « ${fb.label} » proposé à la place.` : `Action non précisée : « ${fb.label} » proposé d’après l’objectif et les coordonnées.` };
}

export function generate(sector: string, data: BriefData, assets: AssetMeta[]): Generated {
  const counts: Partial<Record<AssetCategory, number>> = {};
  assets.forEach(a => { counts[a.category] = (counts[a.category] ?? 0) + 1; });
  const c: Ctx = { d: data, sector, counts, missing: [], prep: new Set(), future: new Set() };
  missingFields(data, sector).forEach(f => c.missing.push({ label: `${f.label} (${f.stepTitle})`, level: f.importance === "required" ? "obligatoire" : "important" }));
  const byS: Record<string, (c: Ctx) => Page[]> = { restaurant, artisan, real_estate: realEstate, hotel, barber_salon: x => salon(x), beauty: x => salon(x), fitness: x => salon(x, true), professional_services: professional, ecommerce };
  const pages = [...(byS[sector] ?? base)(c), ...extras(c)];
  const cta = ctaOptions(c);
  const langs = list(data.languages);
  STEPS.find(s => s.id === "content")!.fields.filter(f => f.type === "availability" && (!f.sectors || f.sectors.includes(sector)))
    .forEach(f => { if (str(data[f.key]) === "to_produce") c.prep.add(f.label); });
  const asset_notes = (Object.keys(CAT) as AssetCategory[]).filter(k => counts[k]).map(k => `${CAT[k]} : ${counts[k]} fichier(s) prêt(s) — à vérifier, aucune attribution automatique`);
  return {
    sector, pages, cta_options: cta.options, cta_default: cta.def, cta_reason: cta.reason,
    navigation_note: langs.length > 1 ? `Sélecteur de langue recommandé (${langs.map(l => LANG[l] ?? l).join(", ")}) : chaque contenu sera à fournir dans chaque langue.` : langs.length ? `Une seule langue : ${LANG[langs[0]] ?? langs[0]}.` : "Langues non renseignées.",
    languages: langs, missing: c.missing, to_prepare: [...c.prep], future_features: [...c.future], asset_notes,
  };
}

export function defaultAdjustments(g: Generated): Adjustments {
  return { page_order: g.pages.map(p => p.id), page_titles: Object.fromEntries(g.pages.map(p => [p.id, p.title])),
    section_order: Object.fromEntries(g.pages.map(p => [p.id, p.sections.map(s => s.id)])), hidden: [], cta: g.cta_default };
}
