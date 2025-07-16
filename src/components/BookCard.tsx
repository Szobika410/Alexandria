
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { syncLikesWithWishlist, updateBookLikeCount, getBookLikeCount } from "@/utils/localStorage";
import { getCurrentCountry, formatPrice } from "@/utils/internationalization";

interface BookCardProps {
  book: {
    id: number;
    title: string;
    author: string;
    price: number;
    condition: string;
    language: string;
    image: string;
    location: string;
    category: string;
    likeCount?: number;
  };
}

const BookCard = ({ book }: BookCardProps) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [likeCount, setLikeCount] = useState(book.likeCount || 0);
  const currentCountry = getCurrentCountry();

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsWishlisted(wishlist.some((item: any) => item.id === book.id));
    syncLikesWithWishlist();
    setLikeCount(getBookLikeCount(book.id) + (book.likeCount || 0));
  }, [book.id]);

  const handleViewDetails = () => {
    navigate(`/book/${book.id}`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isWishlisted) {
      const updatedWishlist = wishlist.filter((item: any) => item.id !== book.id);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsWishlisted(false);
      const newCount = updateBookLikeCount(book.id, false);
      setLikeCount(newCount + (book.likeCount || 0));
    } else {
      const updatedWishlist = [...wishlist, book];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsWishlisted(true);
      const newCount = updateBookLikeCount(book.id, true);
      setLikeCount(newCount + (book.likeCount || 0));
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden group cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="relative">
        <img 
          src={book.image} 
          alt={book.title}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 bg-white/80 hover:bg-white flex items-center gap-1 ${isWishlisted ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
          <span className="text-xs">{likeCount}</span>
        </Button>
      </div>
      
      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{book.title}</h3>
            <p className="text-xs text-gray-600 mb-1">{book.author}</p>
          </div>
          <div className="text-sm font-bold text-orange-600 ml-2">
            {formatPrice(book.price, currentCountry.currency)}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-2">
          <Badge variant="default" className="text-xs bg-orange-100 text-orange-800 border-orange-200">{book.category}</Badge>
          <Badge variant="secondary" className="text-xs">{book.condition}</Badge>
          <Badge variant="outline" className="text-xs">{book.language}</Badge>
          <Badge variant="outline" className="text-xs">{book.location}</Badge>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
