export function buildGenericPaginationHref(basePath: string) {
    return (page: number) => {
      return page > 1 ? `${basePath}?page=${page}` : basePath;
    };
  }
  