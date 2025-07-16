import { useState, useEffect } from "react";
import { ArrowLeft, Camera, Edit, Star, Book, MessageCircle, Settings, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import BottomNavBar from "@/components/BottomNavBar";
import BookCard from "@/components/BookCard";
import { useUser } from "@clerk/clerk-react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("");
  const [userBio, setUserBio] = useState("");

  useEffect(() => {
    if (user && isLoaded) {
      setUserName(user.fullName || user.emailAddresses[0]?.emailAddress || "");
      setUserBio((user.unsafeMetadata as any)?.bio || "");
    }
  }, [user, isLoaded]);

  const userBooks = [
    {
      id: 1,
      title: "Száz év magány",
      author: "Gabriel García Márquez",
      price: 2500,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      category: "fiction",
      condition: "Kiváló",
      language: "Magyar",
      location: "Budapest"
    },
    {
      id: 4,
      title: "Dűne",
      author: "Frank Herbert",
      price: 3200,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop",
      category: "scifi",
      condition: "Kiváló",
      language: "Magyar",
      location: "Pécs"
    }
  ];

  const soldBooks = [
    {
      id: 2,
      title: "A Da Vinci-kód",
      author: "Dan Brown",
      price: 1800,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      category: "crime",
      condition: "Jó",
      language: "Magyar",
      location: "Debrecen"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center p-4 border-b bg-white">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>Vissza</Button>
        <h1 className="text-xl font-semibold">Profil</h1>
      </div>
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Profil</h1>
          <Button variant="ghost" size="sm" onClick={() => navigate("/settings")}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        <div className="px-4 pb-6">
          <div className="flex items-center mb-4">
            <div className="relative">
              <img
                src={user?.imageUrl}
                alt="Profil kép"
                className="w-20 h-20 rounded-full object-cover"
              />
              <Button size="sm" className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-orange-600 hover:bg-orange-700">
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center gap-2 mb-1">
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input 
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)}
                      className="text-lg font-semibold"
                    />
                    <Button variant="ghost" size="sm" onClick={async () => {
                    setIsEditing(false);
                    try {
                      await user?.update({
                        firstName: userName,
                        unsafeMetadata: {
                          bio: userBio
                        }
                      });
                    } catch (error) {
                      console.error('Error updating profile:', error);
                    }
                  }}>
                    <Save className="w-4 h-4" />
                  </Button>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900">{userName}</h2>
                    <Button variant="ghost" size="sm" className="p-1" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>4.8 (127 értékelés)</span>
                </div>
                <span>{(user?.unsafeMetadata as any)?.bio || "Nincs megadva"}</span>
              </div>
              {isEditing ? (
                <Textarea 
                  value={userBio} 
                  onChange={(e) => setUserBio(e.target.value)}
                  placeholder="Írj magadról..."
                  className="text-sm mb-2"
                  rows={3}
                />
              ) : (
                <p className="text-sm text-gray-700 mb-2">{userBio || "Nincs megadva"}</p>
              )}
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">Megbízható eladó</Badge>
                <Badge variant="outline" className="text-xs">Tag 2022 óta</Badge>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-semibold text-gray-900">{userBooks.length}</div>
              <div className="text-sm text-gray-600">Aktív hirdetés</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">{soldBooks.length}</div>
              <div className="text-sm text-gray-600">Eladott könyv</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">42</div>
              <div className="text-sm text-gray-600">Követő</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 pb-20">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active" className="flex items-center gap-1">
              <Book className="w-4 h-4" />
              Aktív
            </TabsTrigger>
            <TabsTrigger value="sold" className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              Eladott
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              Értékelések
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {userBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="sold" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {soldBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
                    alt="Reviewer"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-sm">Anna K.</div>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700">Gyors válaszadás, kiváló állapotú könyv. Csak ajánlani tudom!</p>
                <div className="text-xs text-gray-500 mt-2">2 hete</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavBar />
    </div>
  );
};

export default Profile;