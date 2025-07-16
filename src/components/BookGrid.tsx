
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import BookCard from "./BookCard";
import { allBooks, Book } from "@/data/books";

interface BookGridProps {
  selectedCategory: string;
  searchQuery?: string;
  sortBy?: string;
  appliedFilters?: any;
}

const BookGrid = ({ selectedCategory, searchQuery = "", sortBy = "relevance", appliedFilters }: BookGridProps) => {

  const [displayedBooks, setDisplayedBooks] = useState(8);

  let filteredBooks = selectedCategory === "all" 
    ? allBooks 
    : allBooks.filter(book => book.category === selectedCategory);

  // Apply search filter
  if (searchQuery) {
    filteredBooks = filteredBooks.filter(book => 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply additional filters if available
  if (appliedFilters) {
    if (appliedFilters.category && appliedFilters.category !== "") {
      filteredBooks = filteredBooks.filter(book => book.category === appliedFilters.category);
    }
    
    if (appliedFilters.languages && appliedFilters.languages.length > 0) {
      filteredBooks = filteredBooks.filter(book => {
        const bookLanguage = book.language || "hungarian";
        return appliedFilters.languages.some((lang: string) => {
          if (lang === "hungarian") return bookLanguage === "hungarian" || bookLanguage === "hu";
          if (lang === "romanian") return bookLanguage === "romanian" || bookLanguage === "ro";
          if (lang === "english") return bookLanguage === "english" || bookLanguage === "en";
          return false;
        });
      });
    }
    
    if (appliedFilters.conditions && appliedFilters.conditions.length > 0) {
      filteredBooks = filteredBooks.filter(book => {
        const bookCondition = book.condition || "good";
        return appliedFilters.conditions.includes(bookCondition);
      });
    }
    
    if (appliedFilters.types && appliedFilters.types.length > 0) {
      filteredBooks = filteredBooks.filter(book => {
        const bookType = book.type || "sale";
        return appliedFilters.types.includes(bookType);
      });
    }
    
    if (appliedFilters.priceRange) {
      filteredBooks = filteredBooks.filter(book => 
        book.price >= appliedFilters.priceRange[0] && book.price <= appliedFilters.priceRange[1]
      );
    }
  }

  // Apply sorting
  switch (sortBy) {
    case "price-low":
      filteredBooks = [...filteredBooks].sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filteredBooks = [...filteredBooks].sort((a, b) => b.price - a.price);
      break;
    case "newest":
      filteredBooks = [...filteredBooks].sort((a, b) => b.id - a.id);
      break;
    case "oldest":
      filteredBooks = [...filteredBooks].sort((a, b) => a.id - b.id);
      break;
    case "most-liked":
      filteredBooks = [...filteredBooks].sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
      break;
    case "least-liked":
      filteredBooks = [...filteredBooks].sort((a, b) => (a.likeCount || 0) - (b.likeCount || 0));
      break;
    default:
      // relevance - keep original order
      break;
  }

  const booksToShow = filteredBooks.slice(0, displayedBooks);
  const hasMoreBooks = displayedBooks < filteredBooks.length;

  const loadMoreBooks = useCallback(() => {
    setDisplayedBooks(prev => Math.min(prev + 8, filteredBooks.length));
  }, [filteredBooks.length]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || displayedBooks >= filteredBooks.length) {
        return;
      }
      loadMoreBooks();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreBooks, displayedBooks, filteredBooks.length]);

  return (
    <div className="p-4 pb-20">
      <div className="grid grid-cols-2 gap-4 mb-6">
        {booksToShow.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      
      {hasMoreBooks && (
        <div className="flex justify-center py-4">
          <div className="text-gray-500 text-sm">Görgess tovább a több könyvért...</div>
        </div>
      )}
    </div>
  );
};

export default BookGrid;
