
import { Users, MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CommunityPreview = () => {
  const communities = [
    {
      name: "Fantasy Szerelmesek",
      members: 1250,
      description: "Minden ami fantasy - Tolkientől Martin-ig",
      category: "Műfaj",
      isPremium: false
    },
    {
      name: "Román Irodalom",
      members: 340,
      description: "Román klasszikusok és kortárs művek",
      category: "Nyelv", 
      isPremium: true
    },
    {
      name: "Önfejlesztés Klub",
      members: 890,
      description: "Növekedés könyveken keresztül",
      category: "Téma",
      isPremium: false
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Csatlakozz közösségeinkhez
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Beszélgess kedvenc könyveidről, oszd meg véleményedet és fedezz fel új olvasnivalókat 
            hasonló ízlésű olvasókkal.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {communities.map((community, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900">{community.name}</h3>
                {community.isPremium && (
                  <Badge className="bg-orange-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{community.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  {community.members} tag
                </div>
                <Badge variant="outline" className="text-xs">
                  {community.category}
                </Badge>
              </div>
              
              <Button 
                size="sm" 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Csatlakozás
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6 max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-2">Premium előfizetés</h3>
            <p className="text-sm text-gray-600 mb-4">
              Korlátlan csoporttagság és exkluzív tartalmak
            </p>
            <div className="text-2xl font-bold text-orange-600 mb-4">1990 HUF/hó</div>
            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
              Premium próba
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityPreview;
