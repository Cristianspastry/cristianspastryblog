import { BreadcrumbItem } from "@/components/feature/Breadcrumbs";

export function buildRecipeBreadcrumbs(searchParams: Record<string, string>): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: "Home", href: "/", current: false, emoji: "🏠" },
    { 
      name: "Ricette", 
      href: "/ricette", 
      current: !searchParams.categoria && !searchParams.difficolta && !searchParams.q, 
      emoji: "📖" 
    },
  ];

  if (searchParams.categoria) {
    items.push({
      name: capitalize(searchParams.categoria),
      href: `/ricette?categoria=${searchParams.categoria}`,
      current: true,
      emoji: "🍰",
    });
  } else if (searchParams.difficolta) {
    items.push({
      name: `Difficoltà ${capitalize(searchParams.difficolta)}`,
      href: `/ricette?difficolta=${searchParams.difficolta}`,
      current: true,
      emoji: "📊",
    });
  } else if (searchParams.q) {
    items.push({
      name: `Ricerca: "${searchParams.q}"`,
      href: `/ricette?q=${encodeURIComponent(searchParams.q)}`,
      current: true,
      emoji: "🔍",
    });
  }

  return items;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
