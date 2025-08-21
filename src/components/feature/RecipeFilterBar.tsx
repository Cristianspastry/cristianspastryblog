'use client'
import { Search, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState, useEffect } from "react";

// Componente FilterBar con navigation arrows
interface PageProps {
    searchParams: {
        categoria?: string;
        difficolta?: string;
        q?: string;
        page?: string;
    };
}

export default function RecipeFilterBar({
    categories,
  
}: {
    categories: { name: string; count: number }[];
    searchParams: PageProps['searchParams'];
   
}) {
    const urlSearchParams = useSearchParams();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    
    const currentCategory = urlSearchParams.get('categoria') || 'tutte';
    const currentSearch = urlSearchParams.get('q') || '';

    const findOriginalCategory = (categoryName: string) => {
        return categories.find(c =>
            c.name.toLowerCase() === categoryName.toLowerCase()
        )?.name || categoryName;
    };

    const isCategoryActive = (categoryName: string) => {
        if (categoryName.toLowerCase() === 'tutte') {
            return currentCategory.toLowerCase() === 'tutte' || !currentCategory || currentCategory === '';
        }
        return categoryName.toLowerCase() === currentCategory.toLowerCase();
    };

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        checkScroll();
        const element = scrollRef.current;
        if (element) {
            element.addEventListener('scroll', checkScroll);
            return () => element.removeEventListener('scroll', checkScroll);
        }
    }, [categories]);

    useEffect(() => {
        const handleResize = () => checkScroll();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-4">
                {/* Search Bar */}
                <div className="mb-4 flex justify-center">
                    <form action="/ricette" method="GET" className="w-full max-w-md relative">
                        {currentCategory && currentCategory.toLowerCase() !== 'tutte' && (
                            <input type="hidden" name="categoria" value={findOriginalCategory(currentCategory)} />
                        )}

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                name="q"
                                placeholder="Cerca ricette..."
                                defaultValue={currentSearch}
                                className="w-full pl-10 pr-20 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="submit"
                                className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Cerca
                            </button>
                        </div>
                    </form>
                </div>

                {/* Category Navigation with Arrows */}
                <div className="mb-4 relative">
                    {/* Left Arrow */}
                    {showLeftArrow && (
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-200 rounded-full p-1.5 hover:bg-gray-50 transition-colors"
                            aria-label="Scorri sinistra"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                    )}

                    {/* Right Arrow */}
                    {showRightArrow && (
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-200 rounded-full p-1.5 hover:bg-gray-50 transition-colors"
                            aria-label="Scorri destra"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                    )}

                    {/* Scrollable Categories */}
                    <div 
                        ref={scrollRef}
                        className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 pb-2"
                        style={{ 
                            paddingLeft: showLeftArrow ? '40px' : '0',
                            paddingRight: showRightArrow ? '40px' : '0'
                        }}
                    >
                        <div className="flex gap-2 min-w-max">
                            {/* Link "Tutte" */}
                            <Link
                                href="/ricette"
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                    isCategoryActive('tutte')
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <Tag className="w-3 h-3" />
                                Tutte
                                
                            </Link>

                            {/* Collegamenti categorie */}
                            {categories.map((cat, index) => {
                                if (cat.name.toLowerCase() === 'tutte') return null;

                                const isActive = isCategoryActive(cat.name);
                                
                                let href = `/ricette?categoria=${encodeURIComponent(cat.name)}`;
                                if (currentSearch) {
                                    href += `&q=${encodeURIComponent(currentSearch)}`;
                                }

                                return (
                                    <Link
                                        key={index}
                                        href={href}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                            isActive
                                                ? 'bg-orange-500 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                                        }`}
                                    >
                                        {cat.name}
                                        {cat.count > 0 && (
                                            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold ${
                                                isActive ? 'bg-orange-400 text-white' : 'bg-gray-200 text-gray-600'
                                            }`}>
                                                {cat.count}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="text-center text-sm text-gray-600">
                    
                    {(!isCategoryActive('tutte') || currentSearch) && (
                        <>
                            <span className="mx-2">•</span>
                            <Link
                                href="/ricette"
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Rimuovi filtri
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}