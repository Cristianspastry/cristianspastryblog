function calculatePagination(totalCount: number, currentPage: number, limit: number): { 
    currentPage: number; 
    totalPages: number 
  } {
    return {
      currentPage,
      totalPages: Math.ceil(totalCount / limit)
    };
  }


  export default calculatePagination;