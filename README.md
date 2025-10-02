# Physik-Sammlung

Eine moderne, interaktive Web-App für Physik-Unterrichtsvorhaben in den Bereichen Mechanik, Optik und Elektrizitätslehre.

## 🚀 Features

- **Drei Hauptkategorien**: Mechanik, Optik, Elektrizitätslehre
- **Dynamisches Routing**: Alle Routen und Inhalte werden aus `structure.json` generiert
- **Suche & Filter**: Volltextsuche über Titel, Untertitel und Themen
- **Filter nach**: Klassenstufe (6, 7, 9, 10) und Stundenbereich
- **Type-Safe**: Vollständig typsicher mit TypeScript und Zod-Validierung
- **Responsive Design**: Optimiert für Desktop, Tablet und Mobile
- **Apple-like UI**: Minimalistisches, modernes Design mit Tailwind CSS
- **Accessible**: ARIA-Labels, Keyboard-Navigation, Focus States

## 🛠️ Tech Stack

- **React 18** mit TypeScript
- **Vite** (Build Tool)
- **React Router** (Client-side Routing)
- **Tailwind CSS** (Styling)
- **Zod** (Schema Validation)
- **Lucide React** (Icons)

## 📦 Installation

```bash
# Dependencies installieren
npm install
```

## 🏃 Development

```bash
# Dev-Server starten (http://localhost:5173)
npm run dev
```

## 🔨 Build

```bash
# Production Build erstellen
npm run build

# Build lokal testen
npm run preview
```

## 🧹 Code Quality

```bash
# Lint
npm run lint

# Format
npm run format
```

## 📁 Projektstruktur

```
physik-sammlung/
├── src/
│   ├── components/         # Wiederverwendbare UI-Komponenten
│   │   ├── Header.tsx
│   │   ├── Tile.tsx
│   │   ├── TileGrid.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterBar.tsx
│   │   ├── Breadcrumbs.tsx
│   │   └── EmptyState.tsx
│   ├── pages/             # Seiten-Komponenten
│   │   ├── Dashboard.tsx
│   │   ├── CategoryPage.tsx
│   │   ├── TileDetailPage.tsx
│   │   └── NotFound.tsx
│   ├── lib/               # Business Logic & Utils
│   │   ├── schema.ts      # Zod Schemas
│   │   ├── types.ts       # TypeScript Types
│   │   ├── data.ts        # Data Access Layer
│   │   ├── routing.ts     # Routing Helpers
│   │   └── filters.ts     # Filter Logic
│   ├── data/
│   │   └── structure.json # Content Data
│   ├── styles/
│   │   └── index.css      # Global Styles
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.cjs
└── postcss.config.cjs
```

## 🗺️ Routing

- `/` - Dashboard mit allen Kategorien
- `/:categoryId` - Kategorie-Seite (z.B. `/mechanik`)
- `/:categoryId/:tileId` - Detail-Seite (z.B. `/optik/7-3-das-auge`)
- `*` - 404 Not Found

## 📊 Datenstruktur

Alle Inhalte werden aus `src/data/structure.json` geladen und mit Zod validiert:

```json
{
  "app": {
    "title": "Physik-Simulationen",
    "version": 1
  },
  "categories": [
    {
      "id": "mechanik",
      "title": "Mechanik",
      "route": "/mechanik",
      "tiles": [...]
    }
  ]
}
```

## 🎨 Design-Prinzipien

- **Apple-like**: Klare Hierarchie, viel Weißraum, sanfte Übergänge
- **Minimalismus**: Fokus auf Inhalte, keine überflüssigen Elemente
- **Konsistenz**: Einheitliche Abstände, Farben, Schriften
- **Responsiv**: Mobile-first Ansatz

## 🔮 Zukünftige Features

- [ ] Persistierung von Suche/Filter in URL Query-String
- [ ] Dark Mode Toggle
- [ ] Physik-Simulationen in Detail-Seiten
- [ ] Export/Print-Funktion
- [ ] Favoriten/Lesezeichen

## 📝 Lizenz

Private Project

