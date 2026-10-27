import {
  Building2,
  ChartColumnBig,
  CircleHelp,
  Contact,
  Flag,
  Hammer,
  Images,
  LayoutGrid,
  ListOrdered,
  Menu,
  MoveHorizontal,
  PanelTop,
  Search,
  Settings,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { SECTIONS, SECTION_ORDER, type SectionKey } from "@ofir/content";

/** Destino navegable. Cada `href` necesita su page.tsx en src/app/(dashboard). */
export type NavLink = {
  title: string;
  href: string;
  icon?: LucideIcon;
  /** Se muestra como bajada en el header de la pantalla. */
  description?: string;
  /** Etiqueta corta junto al item (ej. "Nuevo"). */
  badge?: string;
};

/** Item del aside: un link directo o un grupo desplegable con subitems. */
export type NavItem =
  | (NavLink & { icon: LucideIcon; items?: never })
  | {
      title: string;
      icon: LucideIcon;
      items: NavLink[];
      href?: never;
      description?: never;
      badge?: never;
    };

export type NavGroup = Extract<NavItem, { items: NavLink[] }>;

export type NavSection = {
  label: string;
  items: NavItem[];
};

/** Ícono de cada sección de la web en el menú y en las tarjetas de Inicio. */
export const sectionIcons: Record<SectionKey, LucideIcon> = {
  hero: PanelTop,
  marquee: MoveHorizontal,
  services: Wrench,
  stats: ChartColumnBig,
  projects: Images,
  process: ListOrdered,
  mission: Hammer,
  faq: CircleHelp,
  cta: Flag,
  contact: Contact,
  company: Building2,
  menu: Menu,
  seo: Search,
};

export const sectionHref = (key: SectionKey) => `/contenido/${key}`;

/** Las secciones salen del registro del CMS (packages/content): mismo orden que en la web. */
const sectionLinks = (area: "page" | "global") =>
  SECTION_ORDER.filter((key) => SECTIONS[key].area === area).map((key) => ({
    title: SECTIONS[key].navLabel,
    href: sectionHref(key),
    icon: sectionIcons[key],
    description: SECTIONS[key].description,
  }));

export const navigation: NavSection[] = [
  {
    label: "General",
    items: [
      {
        title: "Inicio",
        href: "/",
        icon: LayoutGrid,
        description: "Todas las partes de la web, en el orden en que aparecen.",
      },
    ],
  },
  { label: "Página de inicio", items: sectionLinks("page") },
  { label: "Datos generales", items: sectionLinks("global") },
  {
    label: "Configuración",
    items: [
      {
        title: "Ajustes",
        href: "/ajustes",
        icon: Settings,
        description: "Apariencia del panel y cuentas con acceso.",
      },
    ],
  },
];

/** Links del menú del avatar en la navbar. */
export const userNavigation: NavLink[] = [{ title: "Ajustes", href: "/ajustes", icon: Settings }];
