
import { ArrowLeft, CreditCard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Purchase = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handlePurchase = () => {
    navigate("/purchase-success");
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
          <h1 className="text-lg font-semibold">Vásárlás</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Book summary */}
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
              <p className="text-sm text-gray-500">Eladó: Anna K.</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-orange-600">2500 Ft</p>
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold mb-3">Fizetési mód</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-orange-600"
              />
              <CreditCard className="w-5 h-5 text-gray-600" />
              <span>Bankkártya</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="transfer"
                checked={paymentMethod === "transfer"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-orange-600"
              />
              <span className="w-5 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">Át</span>
              <span>Banki átutalás</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-orange-600"
              />
              <span className="w-5 h-5 bg-green-500 rounded text-white text-xs flex items-center justify-center font-bold">€</span>
              <span>Készpénz átvételkor</span>
            </label>
          </div>
        </div>

        {/* Card details (if card selected) */}
        {paymentMethod === "card" && (
          <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
            <h3 className="font-semibold">Kártya adatok</h3>
            <div>
              <Label htmlFor="cardNumber">Kártya szám</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Lejárat</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVC</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Order summary */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold mb-3">Rendelés összesítő</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Könyv ára:</span>
              <span>2500 Ft</span>
            </div>
            <div className="flex justify-between">
              <span>Szállítás:</span>
              <span>590 Ft</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Platform díj:</span>
              <span>150 Ft</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold text-lg">
              <span>Összesen:</span>
              <span className="text-orange-600">3240 Ft</span>
            </div>
          </div>
        </div>

        {/* Security note */}
        <div className="bg-green-50 rounded-lg p-4 flex items-start space-x-3">
          <Shield className="w-5 h-5 text-green-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-green-800">Biztonságos fizetés</p>
            <p className="text-green-700">A fizetési adataid titkosítva vannak tárolva.</p>
          </div>
        </div>
      </div>

      {/* Bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <Button 
          onClick={handlePurchase}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-3"
        >
          Vásárlás - 3240 Ft
        </Button>
      </div>
    </div>
  );
};

export default Purchase;
