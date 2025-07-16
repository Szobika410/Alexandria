
import { ArrowLeft, MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Trade = () => {
  const navigate = useNavigate();
  const [mySelectedBooks, setMySelectedBooks] = useState<number[]>([]);
  const [theirSelectedBooks, setTheirSelectedBooks] = useState<number[]>([]);

  const myBooks = [
    { id: 1, title: "Harry Potter", author: "J.K. Rowling", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=80&h=120&fit=crop" },
    { id: 2, title: "1984", author: "George Orwell", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=80&h=120&fit=crop" },
    { id: 3, title: "Büszkeség és balítélet", author: "Jane Austen", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=120&fit=crop" },
  ];

  const theirBooks = [
    { id: 4, title: "Száz év magány", author: "Gabriel García Márquez", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=80&h=120&fit=crop" },
    { id: 5, title: "Kriminál", author: "Ferdinandy György", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=80&h=120&fit=crop" },
    { id: 6, title: "Az idő rövid története", author: "Stephen Hawking", image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=80&h=120&fit=crop" },
  ];

  const toggleMyBook = (bookId: number) => {
    setMySelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const toggleTheirBook = (bookId: number) => {
    setTheirSelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleStartTrade = () => {
    if (mySelectedBooks.length > 0 && theirSelectedBooks.length > 0) {
      navigate("/trade-chat", { 
        state: { 
          myBooks: mySelectedBooks, 
          theirBooks: theirSelectedBooks 
        } 
      });
    }
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
          <h1 className="text-lg font-semibold">Csereajánlat</h1>
        </div>
      </div>

      {/* Trade interface */}
      <div className="p-4 space-y-4">
        {/* My books section */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-green-50">
            <h2 className="font-semibold text-green-800">Az én könyveim</h2>
            <p className="text-sm text-green-600">Válaszd ki, mit szeretnél elcserélni</p>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {myBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => toggleMyBook(book.id)}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    mySelectedBooks.includes(book.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex space-x-2">
                    <img 
                      src={book.image} 
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{book.title}</h3>
                      <p className="text-xs text-gray-600 truncate">{book.author}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trade arrow */}
        <div className="flex justify-center py-2">
          <div className="bg-orange-500 text-white p-3 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
        </div>

        {/* Their books section */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-blue-50">
            <h2 className="font-semibold text-blue-800">Anna K. könyvei</h2>
            <p className="text-sm text-blue-600">Válaszd ki, mire szeretnél cserélni</p>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {theirBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => toggleTheirBook(book.id)}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    theirSelectedBooks.includes(book.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex space-x-2">
                    <img 
                      src={book.image} 
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{book.title}</h3>
                      <p className="text-xs text-gray-600 truncate">{book.author}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trade summary */}
        {(mySelectedBooks.length > 0 || theirSelectedBooks.length > 0) && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold mb-2">Csere összefoglaló</h3>
            <div className="text-sm text-gray-600">
              <p>Te adsz: {mySelectedBooks.length} könyv</p>
              <p>Te kapsz: {theirSelectedBooks.length} könyv</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <Button 
          onClick={handleStartTrade}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          disabled={mySelectedBooks.length === 0 || theirSelectedBooks.length === 0}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Csereajánlat elküldése
        </Button>
      </div>
    </div>
  );
};

export default Trade;
