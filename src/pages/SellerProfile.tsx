import { useState } from "react";
import { ArrowLeft, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import BookCard from "@/components/BookCard";
import { getCurrentCountry, getTranslation } from "@/utils/internationalization";

const SellerProfile = () => {
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const [activeTab, setActiveTab] = useState("books");
  const currentCountry = getCurrentCountry();
  const t = (key: string) => getTranslation(key, currentCountry.language);

  // Mock seller data
  const seller = {
    id: sellerId || "1",
    name: "Anna K.",
    bio: "Könyvrajongó vagyok, különösen a klasszikus irodalom és a modern sci-fi érdekel. Gyűjteményemben sok értékes könyv található.",
    rating: 4.8,
    reviewCount: 127,
    joinDate: "2023. március",
    lastActive: "2 órája",
    responseTime: "1 órán belül",
    booksCount: 45,
    soldCount: 32
  };

  // Mock books by seller
  const sellerBooks = [
    {
      id: 1,
      title: "Száz év magány",
      author: "Gabriel García Márquez",
      price: 2500,
      condition: "Kiváló",
      language: "Magyar",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      location: "Budapest",
      category: "fiction",
      likeCount: 12
    },
    {
      id: 2,
      title: "Dűne",
      author: "Frank Herbert",
      price: 3200,
      condition: "Jó",
      language: "Magyar",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop",
      location: "Budapest",
      category: "scifi",
      likeCount: 8
    }
  ];

  const reviews = [
    {
      id: 1,
      reviewer: "Péter G.",
      rating: 5,
      comment: "Kiváló eladó, gyors szállítás és pontos leírás!",
      date: "2024. január 15."
    },
    {
      id: 2,
      reviewer: "Mária T.",
      rating: 4,
      comment: "Jó állapotú könyv, ahogy leírta. Ajánlom!",
      date: "2024. január 10."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{seller.name}</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Profile Header */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold text-2xl">
                {seller.name[0]}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{seller.name}</h2>
              <div className="flex items-center space-x-1 mb-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < Math.floor(seller.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {seller.rating} ({seller.reviewCount} értékelés)
                </span>
              </div>
              <p className="text-sm text-gray-500">Csatlakozott: {seller.joinDate}</p>
              <p className="text-sm text-gray-500">Utoljára aktív: {seller.lastActive}</p>
            </div>
          </div>

          {seller.bio && (
            <div className="mb-4">
              <p className="text-gray-700 text-sm leading-relaxed">{seller.bio}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{seller.booksCount}</p>
              <p className="text-sm text-gray-500">Könyv</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{seller.soldCount}</p>
              <p className="text-sm text-gray-500">Eladott</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{seller.responseTime}</p>
              <p className="text-sm text-gray-500">Válaszidő</p>
            </div>
          </div>

          <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
            <MessageCircle className="w-4 h-4 mr-2" />
            Üzenet küldése
          </Button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("books")}
              className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
                activeTab === "books"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-500"
              }`}
            >
              Könyvei ({seller.booksCount})
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
                activeTab === "reviews"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-500"
              }`}
            >
              Értékelések ({seller.reviewCount})
            </button>
          </div>

          <div className="p-4">
            {activeTab === "books" && (
              <div className="grid grid-cols-2 gap-4">
                {sellerBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium text-sm">
                            {review.reviewer[0]}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{review.reviewer}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${
                              i < review.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{review.comment}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;