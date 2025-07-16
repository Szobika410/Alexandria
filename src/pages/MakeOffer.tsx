
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const MakeOffer = () => {
  const navigate = useNavigate();
  const [offer, setOffer] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOffer = () => {
    console.log("Ajánlat elküldve:", { offer, message });
    navigate("/offer-sent");
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
          <h1 className="text-lg font-semibold">Ajánlattétel</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Book info */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=80&h=120&fit=crop"
              alt="Száz év magány"
              className="w-16 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Száz év magány</h3>
              <p className="text-sm text-gray-600 mb-1">Gabriel García Márquez</p>
              <p className="text-lg font-bold text-orange-600">2500 Ft</p>
            </div>
          </div>
        </div>

        {/* Offer form */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
          <div>
            <Label htmlFor="offer">Az ajánlatod (Ft)</Label>
            <Input
              id="offer"
              type="number"
              placeholder="1800"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="message">Üzenet (opcionális)</Label>
            <textarea
              id="message"
              placeholder="Írd le, miért érdekel ez a könyv..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              rows={4}
            />
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Tippek sikeres ajánlathoz:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Légy udvarias és részletes</li>
            <li>• Adj reális ajánlatot</li>
            <li>• Magyarázd el, miért érdekel a könyv</li>
          </ul>
        </div>
      </div>

      {/* Bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <Button 
          onClick={handleSendOffer}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          disabled={!offer}
        >
          <Send className="w-4 h-4 mr-2" />
          Ajánlat elküldése
        </Button>
      </div>
    </div>
  );
};

export default MakeOffer;
