import { ArrowLeft, Camera, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Publish = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const handlePublish = () => {
    console.log("Könyv publikálva:", { title, author, description, price, condition, category, images });
    navigate("/");
  };

  const addImage = () => {
    // Placeholder image addition
    const newImage = `https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&random=${Math.random()}`;
    setImages([...images, newImage]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Könyv hirdetése</h1>
          <Button 
            onClick={handlePublish}
            className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-4"
            disabled={!title || !author || !price}
          >
            Publikálás
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Images */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <Label className="text-base font-medium mb-3 block">Képek</Label>
          <div className="grid grid-cols-3 gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img 
                  src={image} 
                  alt={`Könyv kép ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
            {images.length < 6 && (
              <Button
                variant="outline"
                onClick={addImage}
                className="h-24 border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50"
              >
                <Camera className="w-6 h-6 text-gray-400" />
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">Legfeljebb 6 képet tölthetsz fel</p>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
          <div>
            <Label htmlFor="title">Könyv címe *</Label>
            <Input
              id="title"
              placeholder="pl. Harry Potter és a bölcsek köve"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="author">Szerző *</Label>
            <Input
              id="author"
              placeholder="pl. J.K. Rowling"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category">Kategória</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Válassz kategóriát" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fiction">Szépirodalom</SelectItem>
                <SelectItem value="crime">Krimi</SelectItem>
                <SelectItem value="romance">Romantikus</SelectItem>
                <SelectItem value="fantasy">Fantasy</SelectItem>
                <SelectItem value="scifi">Sci-fi</SelectItem>
                <SelectItem value="biography">Életrajz</SelectItem>
                <SelectItem value="history">Történelem</SelectItem>
                <SelectItem value="science">Tudomány</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <Label htmlFor="description">Leírás</Label>
          <Textarea
            id="description"
            placeholder="Írj a könyvről, állapotáról, miért szeretnéd eladni..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 min-h-[100px]"
          />
        </div>

        {/* Condition & Price */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
          <div>
            <Label htmlFor="condition">Állapot</Label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Válassz állapotot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Új</SelectItem>
                <SelectItem value="excellent">Kiváló</SelectItem>
                <SelectItem value="good">Jó</SelectItem>
                <SelectItem value="fair">Megfelelő</SelectItem>
                <SelectItem value="poor">Rossz</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price">Ár (Ft) *</Label>
            <Input
              id="price"
              type="number"
              placeholder="2500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Tippek sikeres hirdetéshez:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Tölts fel több, jó minőségű képet</li>
            <li>• Írj részletes és őszinte leírást</li>
            <li>• Add meg a könyv pontos állapotát</li>
            <li>• Használj megfelelő árazást</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Publish;