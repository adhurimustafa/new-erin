# Tadam! Brand Guidelines

## Brand Identity

**Nom:** Tadam!  
**Tagline:** Brief → Tadam → en ligne  
**Positionnement:** Sites web professionnels livrés en 4–8h (ou 48–72h)

---

## Palette de Couleurs

### Couleurs Principales

- **Midnight** (Nuit profonde): `#0B0F19` | `HSL(222, 42%, 8%)`
- **Cyan** (Cyan électrique): `#00E6FF` | `HSL(185, 100%, 50%)`
- **Indigo** (Indigo premium): `#5B8CFF` | `HSL(222, 70%, 65%)`
- **Violet** (Violet lumineux): `#9B5BFF` | `HSL(263, 70%, 65%)`
- **Ivory** (Ivoire): `#F3F4F6` | `HSL(210, 20%, 96%)`

### Dégradés

- **Gradient Tadam!**: `linear-gradient(135deg, #00E6FF, #5B8CFF, #9B5BFF)`
- **Gradient Radial**: `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 230, 255, 0.2), #0B0F19)`

---

## Typographie

### Titres (H1-H6)
- **Police:** Poppins SemiBold (600) ou Sora SemiBold (600)
- **Letterspacing:** -0.02em (serré)
- **Usage:** Tous les titres, headings, et textes importants

### Corps de Texte
- **Police:** Inter Regular/Medium ou Manrope Regular/Medium
- **Usage:** Paragraphes, descriptions, textes courants
- **Features:** `rlig` et `calt` activés pour ligatures

---

## Logo & Assets

### Wordmark
- **Fichier master:** `public/logo-tadam-wordmark.png`
- **Style:** "Tadam!" en Poppins SemiBold avec gradient cyan → indigo → violet
- **Glow:** Subtil (20% opacité maximum)
- **Usage:** Header, footer, communications officielles

### Icône
- **Fichiers:** `public/icon-512.png`, `public/favicon.png`, `public/apple-touch-icon.png`
- **Style:** Point d'exclamation "!" stylisé dans un cercle
- **Usage:** Favicon, app icons, réseaux sociaux

### Open Graph
- **Fichier:** `public/og-image.png` (1200×630px)
- **Usage:** Partages sur réseaux sociaux (Facebook, LinkedIn, Twitter)

---

## Zone de Sécurité

**Safe Area:** Hauteur du "T" du wordmark tout autour du logo  
**Minimum:** Ne jamais réduire le logo en dessous de 120px de largeur  
**Alignement:** Aligner optiquement le "!" pour un équilibre visuel à droite

---

## UI Design System

### Glassmorphism
- **Background:** `rgba(255, 255, 255, 0.02)`
- **Backdrop-filter:** `blur(20px)`
- **Border:** `1px solid rgba(255, 255, 255, 0.08)`
- **Border-radius:** `2rem` (32px)

### Effets
- **Shadow Glow:** `0 0 40px hsl(185 100% 50% / 0.3), 0 0 80px hsl(222 70% 65% / 0.2)`
- **Text Glow:** `0 0 20px hsl(185 100% 50% / 0.5)`
- **Transition:** `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`

### Radius Standards
- **XL:** `2rem` (cards principales)
- **LG:** `1.5rem` (cards secondaires)
- **MD:** `1rem` (boutons, inputs)

---

## Règles d'Usage

### ✅ À FAIRE
- Utiliser le dégradé Tadam! pour les éléments importants
- Respecter la zone de sécurité autour du logo
- Maintenir le contraste AA pour l'accessibilité
- Utiliser glassmorphism pour les surfaces interactives
- Préférer le fond Midnight (#0B0F19) pour le dark mode

### ❌ À ÉVITER
- Ne jamais étirer ou déformer le logo
- Ne jamais utiliser le logo sur des fonds trop chargés
- Éviter les halos trop agressifs (> 20% opacité)
- Ne pas utiliser de couleurs autres que la palette officielle
- Ne pas réduire le logo en dessous de 120px de largeur

---

## Accessibilité

- **Contraste minimum:** AA (4.5:1 pour texte normal, 3:1 pour texte large)
- **Focus rings:** Visibles avec `ring-cyan` sur tous les éléments interactifs
- **Tailles d'interaction:** Minimum 44×44px pour les boutons et liens
- **ARIA labels:** Toujours inclure sur les icônes interactives

---

## PWA & Meta Tags

### Manifest
```json
{
  "name": "Tadam! - Votre site en ligne en 4h",
  "short_name": "Tadam!",
  "theme_color": "#00E6FF",
  "background_color": "#0B0F19"
}
```

### Meta Tags Essentiels
```html
<title>Tadam! - Brief → Tadam → en ligne</title>
<meta name="description" content="Votre site clair, mobile et prêt à convertir — en 4–8h (ou 48–72h)" />
<meta name="theme-color" content="#00E6FF" />
```

---

## Export des Assets

Tous les assets sont disponibles dans le dossier `public/`:
- `logo-tadam-wordmark.png` (1920×512px)
- `icon-512.png` (512×512px)
- `favicon.png` (512×512px, optimisé pour petites tailles)
- `apple-touch-icon.png` (512×512px, safe area incluse)
- `og-image.png` (1200×630px)

---

## Tokens de Brand (JSON)

```json
{
  "name": "Tadam!",
  "colors": {
    "bg": "#0B0F19",
    "cyan": "#00E6FF",
    "indigo": "#5B8CFF",
    "violet": "#9B5BFF",
    "ivory": "#F3F4F6"
  },
  "fonts": {
    "title": "Poppins|Sora",
    "text": "Inter|Manrope"
  },
  "radius": "2rem",
  "transition": "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
}
```

---

**Version:** 1.0  
**Date:** 2025-09-30  
**Contact:** Tadam Studio
