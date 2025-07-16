import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CreateGroup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    privacy: "public"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would create the group
    console.log("Creating group:", formData);
    navigate("/messages");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
            <h1 className="text-lg font-semibold">Új csoport létrehozása</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 pb-24">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Group Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Csoport neve *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="pl. Krimi rajongók"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Leírás *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Írj egy rövid leírást a csoportról..."
                rows={4}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Kategória *</Label>
              <Select onValueChange={(value) => handleInputChange("category", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Válassz kategóriát" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="genre">Műfaj</SelectItem>
                  <SelectItem value="author">Szerző</SelectItem>
                  <SelectItem value="language">Nyelv</SelectItem>
                  <SelectItem value="academic">Tanulmányok</SelectItem>
                  <SelectItem value="bookclub">Könyvklub</SelectItem>
                  <SelectItem value="reviews">Értékelések</SelectItem>
                  <SelectItem value="other">Egyéb</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Privacy */}
            <div className="space-y-2">
              <Label htmlFor="privacy">Láthatóság</Label>
              <Select onValueChange={(value) => handleInputChange("privacy", value)} defaultValue="public">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Nyilvános - Bárki csatlakozhat</SelectItem>
                  <SelectItem value="private">Privát - Csak meghívással</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Group Rules */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Csoport szabályok</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Legyél tiszteletteljes és kulturált</li>
                <li>• Csak a csoport témájához kapcsolódó tartalmakat ossz meg</li>
                <li>• Ne reklamozz vagy spam-elj</li>
                <li>• Respect mások véleményét</li>
              </ul>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Mégse
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                disabled={!formData.name || !formData.description || !formData.category}
              >
                Csoport létrehozása
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;