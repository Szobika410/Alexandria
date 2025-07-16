import { useState, useEffect } from "react";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BookCard from "@/components/BookCard";
import BottomNavBar from "@/components/BottomNavBar";
import { getCurrentCountry, getTranslation } from "@/utils/internationalization";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const currentCountry = getCurrentCountry();
  const t = (key: string) => getTranslation(key, currentCountry.language);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlistBooks(JSON.parse(savedWishlist));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{t('wishlist')}</h1>
        </div>
      </div>

      <div className="p-4 pb-20">
        {wishlistBooks.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('emptyWishlist')}</h3>
            <p className="text-gray-600">{t('emptyWishlistDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {wishlistBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>

      <BottomNavBar />
    </div>
  );
};

export default Wishlist;