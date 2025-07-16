import { ArrowLeft, Heart, Star, MessageCircle, RefreshCw, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { allBooks } from "@/data/books";
import { getCurrentCountry, formatPrice, getTranslation } from "@/utils/internationalization";
import { getBookLikeCount, syncLikesWithWishlist } from "@/utils/localStorage";

const BookDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const currentCountry = getCurrentCountry();
  const t = (key: string) => getTranslation(key, currentCountry.language);

  const bookData = allBooks.find(b => b.id === parseInt(id || "1")) || allBooks[0];

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsSaved(wishlist.some((item: any) => item.id === bookData.id));
    syncLikesWithWishlist();
    setLikeCount(getBookLikeCount(bookData.id) + (bookData.likeCount || 0));
  }, [bookData.id]);

  // Enhanced book object with additional details
  const bookDetails = {
    ...bookData,
    seller: {
      id: "seller1",
      name: "Anna K.",
      rating: 4.8,
      reviewCount: 127,
      lastActive: t('hoursAgo').replace('{hours}', '2'),
      responseTime: t('withinHour')
    },
    details: {
      isbn: "978-963-11-1234-5",
      publisher: "Európa Könyvkiadó",
      year: "2019",
      pages: "432",
      language: bookData.language
    },
    images: [
      bookData.image,
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop"
    ]
  };

  const handleWishlistToggle = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isSaved) {
      const updatedWishlist = wishlist.filter((item: any) => item.id !== bookData.id);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsSaved(false);
    } else {
      const updatedWishlist = [...wishlist, bookData];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsSaved(true);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % bookDetails.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + bookDetails.images.length) % bookDetails.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="text-gray-700 mr-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">{t('bookDetails')}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 pb-24">
        {/* Book images */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="relative flex justify-center mb-4">
            <img 
              src={bookDetails.images[currentImageIndex]}
              alt={bookDetails.title}
              className="w-64 h-80 object-cover rounded-lg shadow-lg"
            />
            {bookDetails.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
          
          {/* Additional images thumbnails */}
          <div className="flex gap-2 justify-center mb-4 overflow-x-auto">
            {bookDetails.images.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`Kép ${index + 1}`} 
                className={`w-16 h-20 object-cover rounded border-2 cursor-pointer ${
                  index === currentImageIndex ? 'border-orange-200' : 'border-gray-200'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>

          {/* Book info */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <h1 className="text-xl font-bold text-gray-900 mr-2">{bookDetails.title}</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600">{likeCount}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleWishlistToggle}
                  className={`p-2 ${isSaved ? 'text-red-500' : 'text-gray-400'}`}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
            <p className="text-gray-700 mb-2">{bookDetails.author}</p>
            <p className="text-2xl font-bold text-orange-600 mb-3">
              {formatPrice(bookDetails.price, currentCountry.currency)}
            </p>
            <Badge variant="secondary" className="mb-4">
              {bookDetails.condition}
            </Badge>
            
            {/* Short description */}
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">{t('shortDescription')}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('noDescription')}
              </p>
            </div>
          </div>
        </div>

        {/* Book details */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
          <h3 className="font-semibold text-gray-900 mb-3">{t('bookDetails')}</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">ISBN:</span>
              <p className="font-medium">{bookDetails.details.isbn}</p>
            </div>
            <div>
              <span className="text-gray-500">Kiadó:</span>
              <p className="font-medium">{bookDetails.details.publisher}</p>
            </div>
            <div>
              <span className="text-gray-500">Kiadás éve:</span>
              <p className="font-medium">{bookDetails.details.year}</p>
            </div>
            <div>
              <span className="text-gray-500">Oldalszám:</span>
              <p className="font-medium">{bookDetails.details.pages}</p>
            </div>
            <div>
              <span className="text-gray-500">Nyelv:</span>
              <p className="font-medium">{bookDetails.details.language}</p>
            </div>
          </div>
        </div>

        {/* Seller info */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">{t('sellerInfo')}</h3>
          <div 
            className="flex items-center space-x-3 mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            onClick={() => navigate(`/seller/${bookDetails.seller.id}`)}
          >
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-semibold text-lg">
                {bookDetails.seller.name[0]}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{bookDetails.seller.name}</p>
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < Math.floor(bookDetails.seller.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {bookDetails.seller.rating} ({bookDetails.seller.reviewCount} {t('ratings')})
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {t('lastActive')}: {bookDetails.seller.lastActive}
              </p>
              <p className="text-xs text-gray-500">
                {t('responseTime')}: {t('usually')} {bookDetails.seller.responseTime}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50"
            onClick={() => navigate("/make-offer")}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Ajánlattétel
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={() => navigate("/trade")}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Csere
          </Button>
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => navigate("/purchase")}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Vásárlás
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;