import { useState } from "react";
import { ArrowLeft, MessageCircle, Search, Users, Heart, Star, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import BottomNavBar from "@/components/BottomNavBar";

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  avatar: string;
}

interface Group {
  id: number;
  name: string;
  description: string;
  members: number;
  category: string;
  lastPost: string;
  time: string;
  isJoined: boolean;
  avatar: string;
}

const Messages = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [groupSearchQuery, setGroupSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chats");
  const [joinedGroups, setJoinedGroups] = useState<number[]>([1, 3]);

  const chats: Chat[] = [
    {
      id: 1,
      name: "Anna K.",
      lastMessage: "Elfogadom a csere ajánlatot!",
      time: "2 perc",
      unread: true,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Péter M.",
      lastMessage: "Mikor tudnánk találkozni?",
      time: "1 óra",
      unread: false,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Eszter L.",
      lastMessage: "Köszönöm a gyors választ!",
      time: "3 óra",
      unread: false,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
    }
  ];

  const groups: Group[] = [
    {
      id: 1,
      name: "Fantasy Szerelmesek",
      description: "Minden ami fantasy - Tolkientől Martin-ig",
      members: 1250,
      category: "Műfaj",
      lastPost: "Új Sanderson könyv megjelent!",
      time: "2 óra",
      isJoined: joinedGroups.includes(1),
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Román Irodalom",
      description: "Román klasszikusok és kortárs művek",
      members: 340,
      category: "Nyelv",
      lastPost: "Mircea Eliade újraolvasva",
      time: "4 óra",
      isJoined: joinedGroups.includes(2),
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Könyv Influencerek",
      description: "Petra könyves ajánlói",
      members: 890,
      category: "Influencer",
      lastPost: "5 könyv amit idén el kell olvasnod",
      time: "1 nap",
      isJoined: joinedGroups.includes(3),
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
    }
  ];

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(groupSearchQuery.toLowerCase())
  );

  const handleJoinGroup = (groupId: number) => {
    setJoinedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Üzenetek</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chats">Chatek</TabsTrigger>
            <TabsTrigger value="groups">Csoportok</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chats" className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Keresés a beszélgetésekben..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="groups" className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Keresés a csoportokban..."
                value={groupSearchQuery}
                onChange={(e) => setGroupSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="chats">
            {filteredChats.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Még nincsenek üzeneteid</h3>
                <p className="text-gray-600">Kezdj el beszélgetni másokkal könyvekről!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => navigate(`/trade-chat?user=${chat.name}`)}
                    className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm font-medium ${chat.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                          {chat.name}
                        </h3>
                        <span className="text-xs text-gray-500">{chat.time}</span>
                      </div>
                      <p className={`text-sm truncate ${chat.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                        {chat.lastMessage}
                      </p>
                    </div>
                    {chat.unread && (
                      <div className="w-2 h-2 bg-orange-600 rounded-full ml-2"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="groups">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Csoportok</h2>
                <Button 
                  size="sm" 
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={() => navigate("/create-group")}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Új csoport
                </Button>
              </div>
              
              <div className="space-y-3">
                {filteredGroups.map((group) => (
                  <div 
                    key={group.id} 
                    className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/group/${group.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{group.name}</h3>
                          <p className="text-sm text-gray-600">{group.members} tag • {group.category}</p>
                          <p className="text-xs text-gray-500 mt-1">{group.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant={group.isJoined ? "secondary" : "outline"}
                          className={`${group.isJoined ? 'bg-green-100 text-green-700' : 'border-orange-600 text-orange-600 hover:bg-orange-50'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinGroup(group.id);
                          }}
                        >
                          {group.isJoined ? 'Csatlakozva' : 'Csatlakozás'}
                        </Button>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavBar />
    </div>
  );
};

export default Messages;