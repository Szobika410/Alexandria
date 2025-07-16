
import { Home, Heart, MessageCircle, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentCountry, getTranslation } from "@/utils/internationalization";

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentCountry = getCurrentCountry();
  const t = (key: string) => getTranslation(key, currentCountry.language);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex flex-col items-center p-2 ${location.pathname === "/" ? "text-orange-600" : "text-gray-600"}`} 
          onClick={() => navigate("/")}
        >
          <Home className="w-5 h-5 mb-1" />
          <span className="text-xs">{t('homeTab')}</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex flex-col items-center p-2 ${location.pathname === "/wishlist" ? "text-orange-600" : "text-gray-600"}`} 
          onClick={() => navigate("/wishlist")}
        >
          <Heart className="w-5 h-5 mb-1" />
          <span className="text-xs">{t('wishlistTab')}</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex flex-col items-center p-2 text-white bg-orange-600 rounded-full w-12 h-12" 
          onClick={() => navigate("/publish")}
        >
          <Plus className="w-6 h-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex flex-col items-center p-2 ${location.pathname === "/messages" ? "text-orange-600" : "text-gray-600"}`} 
          onClick={() => navigate("/messages")}
        >
          <MessageCircle className="w-5 h-5 mb-1" />
          <span className="text-xs">{t('messagesTab')}</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex flex-col items-center p-2 ${location.pathname === "/profile" ? "text-orange-600" : "text-gray-600"}`} 
          onClick={() => navigate("/profile")}
        >
          <User className="w-5 h-5 mb-1" />
          <span className="text-xs">{t('profileTab')}</span>
        </Button>
      </div>
    </div>
  );
};

export default BottomNavBar;
