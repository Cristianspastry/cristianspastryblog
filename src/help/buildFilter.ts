export default function buildFilter(categoria?: string, difficolta?: string, search?: string): string {
    const filters = [];
    
    if (categoria) {
      filters.push(`categories[]->title match "${categoria}*"`);
    }
    
    if (difficolta) {
      filters.push(`difficulty == "${difficolta}"`);
    }
    
    if (search) {
      filters.push(`(title match "${search}*" || excerpt match "${search}*")`);
    }
    
    return filters.length > 0 ? ` && (${filters.join(' && ')})` : '';
  }