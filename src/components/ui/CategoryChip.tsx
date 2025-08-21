/*

 COMPONENTE CHE PUNTA ALL' FILTRO /ricette/${category}

    DIRETTIVA 'USE CLIENT' PER 'USE ROUTER'

*/


"use client"

import { useRouter } from "next/navigation";
import type { MouseEvent } from 'react';

type Category = {
    title: string;
    // Add other properties if needed
};

type Props = {
    cat: Category;
    category: string;
}

export default function CategoryChip({cat,category} : Props) {
    
    const router = useRouter();
    return (
        <button
        key={cat.title}
        className="bg-[#0D2858] backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium"
        aria-label={`Filtra per categoria ${category}`}
        onClick={(e : MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/ricette?category=${encodeURIComponent(category)}`);
        }}

      >
        {cat.title}
      </button>
    );
}