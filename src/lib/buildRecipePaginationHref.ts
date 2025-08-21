export function buildRecipePaginationHref(
    page: number,
    searchParams: Record<string, string>
  ): string {
    const params = new URLSearchParams();
  
    if (searchParams.categoria) params.set("categoria", searchParams.categoria);
    if (searchParams.difficolta) params.set("difficolta", searchParams.difficolta);
    if (searchParams.q) params.set("q", searchParams.q);
  
    if (page > 1) params.set("page", page.toString());
  
    return `/ricette${params.toString() ? "?" + params.toString() : ""}`;
  }
  