import { useState, useEffect } from "react";
import { ArrowLeft, MessageCircle, Heart, Share, Send, Image, FileText, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "react-router-dom";
import BottomNavBar from "@/components/BottomNavBar";
import { getCurrentCountry, getTranslation } from "@/utils/internationalization";

const GroupDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Anna K.",
      time: "2 órája",
      content: "Éppen befejeztem a Száz év magányt. Fantasztikus könyv! Kit érdekel Márquez varázslatos realizmusa?",
      likes: 5,
      replies: 3,
      isLiked: false,
      comments: [
        { id: 1, author: "Péter G.", content: "Nekem is nagyon tetszett! A Buendía család története lenyűgöző.", time: "1 órája" },
        { id: 2, author: "Mária T.", content: "Már régen szerettem volna elolvasni, most ráveszed hogy megvegyem 😊", time: "30 perce" }
      ],
      showComments: false
    },
    {
      id: 2,
      author: "Péter G.",
      time: "4 órája",
      content: "Van valakinek jó sci-fi ajánlása? Mostanában ez a műfaj érdekel.",
      likes: 8,
      replies: 5,
      isLiked: false,
      comments: [
        { id: 1, author: "János B.", content: "Isaac Asimov Alapítvány sorozata fantasztikus!", time: "3 órája" },
        { id: 2, author: "Éva S.", content: "Philip K. Dick könyvei is nagyon jók, különösen az Álmodnak-e az androidok elektrobirányokról?", time: "2 órája" }
      ],
      showComments: false
    }
  ]);
  const [newComment, setNewComment] = useState("");
  const currentCountry = getCurrentCountry();
  const t = (key: string) => getTranslation(key, currentCountry.language);

  // Mock group data
  const group = {
    id: id || "1",
    name: "Sci-fi rajongók",
    description: "Tudományos-fantasztikus irodalom szerelmeseinek közössége",
    members: 1247,
    category: "Műfaj"
  };

  const handleLikePost = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const toggleComments = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, showComments: !post.showComments }
        : post
    ));
  };

  const handleAddComment = (postId: number) => {
    if (!newComment.trim()) return;
    
    setPosts(posts.map(post => 
      post.id === postId 
        ? {
            ...post,
            comments: [
              ...post.comments,
              {
                id: post.comments.length + 1,
                author: "Te",
                content: newComment,
                time: "Most"
              }
            ],
            replies: post.replies + 1
          }
        : post
    ));
    setNewComment("");
  };

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      const newPostObj = {
        id: Date.now(),
        author: "Te",
        time: "most",
        content: newPost,
        likes: 0,
        replies: 0,
        isLiked: false,
        comments: [],
        showComments: false
      };
      setPosts([newPostObj, ...posts]);
      setNewPost("");
      setShowNewPost(false);
    }
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
              onClick={() => navigate('/messages')}
              className="text-gray-700 mr-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold">{group.name}</h1>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            Csatlakozás
          </Button>
        </div>
      </div>

      {/* Group Info */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-orange-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{group.name}</h2>
            <p className="text-gray-600">{group.members} tag</p>
            <Badge variant="secondary" className="mt-1">{group.category}</Badge>
          </div>
        </div>
        <p className="text-gray-700 mb-3">{group.description}</p>
        
        <Button 
          onClick={() => setShowNewPost(!showNewPost)}
          variant="outline" 
          className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Új bejegyzés
        </Button>
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-semibold">Te</span>
            </div>
            <div className="flex-1">
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-3">
                  <TabsTrigger value="text" className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    Szöveg
                  </TabsTrigger>
                  <TabsTrigger value="image" className="flex items-center gap-1">
                    <Image className="w-4 h-4" />
                    Kép
                  </TabsTrigger>
                  <TabsTrigger value="document" className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    Dokumentum
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="text">
                  <Textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Oszd meg gondolataidat a csoporttal..."
                    className="w-full resize-none"
                    rows={3}
                  />
                </TabsContent>
                
                <TabsContent value="image">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Kattints vagy húzd ide a képet</p>
                    <input type="file" accept="image/*" className="hidden" />
                  </div>
                </TabsContent>
                
                <TabsContent value="document">
                  <div className="space-y-3">
                    <Textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Cím: Könyv elemzésem..."
                      className="w-full resize-none font-medium"
                      rows={1}
                    />
                    <Textarea
                      placeholder="Írd ide a részletes szövegedet, elemzésedet, jegyzeteidet..."
                      className="w-full resize-none"
                      rows={6}
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end mt-3">
                <Button 
                  onClick={handlePostSubmit}
                  disabled={!newPost.trim()}
                  className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Közzététel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts */}
      <div className="p-4 space-y-4 pb-24">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-semibold text-sm">
                  {post.author[0]}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{post.author}</p>
                <p className="text-sm text-gray-500">{post.time}</p>
              </div>
            </div>
            
            <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
            
            <div className="flex items-center space-x-6 text-gray-500">
              <button 
                onClick={() => handleLikePost(post.id)}
                className={`flex items-center space-x-1 hover:text-red-500 ${post.isLiked ? 'text-red-500' : ''}`}
              >
                <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-500' : ''}`} />
                <span className="text-sm">{post.likes}</span>
              </button>
              <button 
                onClick={() => toggleComments(post.id)}
                className="flex items-center space-x-1 hover:text-blue-500"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{post.replies} {t('comments')}</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-green-500">
                <Share className="w-4 h-4" />
              </button>
            </div>

            {/* Comments Section */}
            {post.showComments && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="space-y-3 mb-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-sm">
                          {comment.author[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="font-medium text-sm text-gray-900">{comment.author}</p>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{comment.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Add Comment Form */}
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-medium text-sm">Te</span>
                  </div>
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={t('writeComment')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <Button
                      onClick={() => handleAddComment(post.id)}
                      disabled={!newComment.trim()}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      {t('postComment')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <BottomNavBar />
    </div>
  );
};

export default GroupDetail;