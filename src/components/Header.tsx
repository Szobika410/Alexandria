
import { Search, User, Heart, MessageCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-orange-200 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        {/* Mobile header */}
        <div className="flex items-center justify-between md:hidden">
          <h1 className="text-xl font-bold text-orange-800">KönyvCsere</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Keress könyveket..." 
                className="pl-10 border-orange-200 focus:border-orange-400"
              />
            </div>
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-gray-700 hover:text-orange-600 py-2">Böngészés</a>
              <a href="#" className="text-gray-700 hover:text-orange-600 py-2">Csere</a>
              <a href="#" className="text-gray-700 hover:text-orange-600 py-2">Mit keresek</a>
              <a href="#" className="text-gray-700 hover:text-orange-600 py-2">Közösség</a>
            </nav>
            <div className="flex flex-col space-y-2">
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-orange-600 justify-start">
                <Heart className="w-4 h-4 mr-2" />
                Kívánságok
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-orange-600 justify-start">
                <MessageCircle className="w-4 h-4 mr-2" />
                Üzenetek
              </Button>
              <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-50 justify-start">
                <User className="w-4 h-4 mr-2" />
                Profil
              </Button>
            </div>
          </div>
        )}

        {/* Desktop header */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-orange-800">KönyvCsere</h1>
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-700 hover:text-orange-600 transition-colors">Böngészés</a>
              <a href="#" className="text-gray-700 hover:text-orange-600 transition-colors">Csere</a>
              <a href="#" className="text-gray-700 hover:text-orange-600 transition-colors">Mit keresek</a>
              <a href="#" className="text-gray-700 hover:text-orange-600 transition-colors">Közösség</a>
            </nav>
          </div>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Keress könyveket, szerzőket..." 
                className="pl-10 border-orange-200 focus:border-orange-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-700 hover:text-orange-600">
              <Heart className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Kívánságok</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-700 hover:text-orange-600">
              <MessageCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Üzenetek</span>
            </Button>
            <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-50">
              <User className="w-4 h-4 mr-2" />
              Profil
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
