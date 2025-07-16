
import { ArrowLeft, Send, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const TradeChat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "me",
      text: "Szia! Érdekelne a csere az alábbi könyvekkel:",
      timestamp: "14:30",
      type: "trade-offer"
    },
    {
      id: 2,
      sender: "other",
      text: "Szia! Megnézem az ajánlatodat, érdekes lehet!",
      timestamp: "14:35",
      type: "message"
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "me",
        text: message,
        timestamp: new Date().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }),
        type: "message"
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleAcceptTrade = () => {
    navigate("/trade-success");
  };

  const handleDeclineTrade = () => {
    navigate("/trade-declined");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="text-gray-700 mr-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Anna K.</h1>
              <p className="text-sm text-green-600">Online</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-orange-600 font-semibold">A</span>
          </div>
        </div>
      </div>

      {/* Trade offer summary */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <h3 className="font-semibold text-orange-800 mb-2">Aktív csereajánlat</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">Te adsz:</p>
              <p className="text-gray-600">• Harry Potter</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Te kapsz:</p>
              <p className="text-gray-600">• Száz év magány</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-white flex-1"
              onClick={handleAcceptTrade}
            >
              <Check className="w-4 h-4 mr-1" />
              Elfogadom
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-red-300 text-red-700 hover:bg-red-50 flex-1"
              onClick={handleDeclineTrade}
            >
              <X className="w-4 h-4 mr-1" />
              Elutasítom
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === 'me'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${
                msg.sender === 'me' ? 'text-orange-200' : 'text-gray-500'
              }`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Írj üzenetet..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            className="bg-orange-600 hover:bg-orange-700 text-white"
            disabled={!message.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TradeChat;
