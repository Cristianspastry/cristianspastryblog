import { BreadcrumbItem } from "@/components/feature/Breadcrumbs";

type GenericBreadcrumbOptions = {
  label: string;   // Nome della pagina es: "Chi sono"
  href: string;    // URL es: "/chi-sono"
  emoji?: string;  // Emoji opzionale
};

export function buildGenericBreadcrumbs({ label, href, emoji }: GenericBreadcrumbOptions): BreadcrumbItem[] {
  return [
    { name: "Home", href: "/", current: false, emoji: "🏠" },
    { name: label, href, current: true, emoji: emoji ?? "📄" },
  ];
}


// esempio 

/*export default function ChiSonoPage() {
    const items = buildGenericBreadcrumbs({
      label: "Chi sono",
      href: "/chi-sono",
      emoji: "👨‍🍳"
    });
  
    return (
      <div>
        <Breadcrumbs items={items} />
        <h1>Chi sono</h1>
        <p>Testo della pagina...</p>
      </div>
    );
  }*/