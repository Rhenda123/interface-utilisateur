
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Reply, User, Clock, Plus, Search, ArrowLeft, Send } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  createdAt: string;
  replies: Reply[];
}

interface Reply {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

const initialPosts: Post[] = [
  {
    id: "1",
    title: "Conseils pour réviser les examens de fin d'année",
    content: "Salut ! Quelqu'un a-t-il des techniques efficaces pour réviser ? Je me sens un peu dépassé...",
    author: "Marie_L",
    category: "Études",
    createdAt: "2025-01-10T14:30:00Z",
    replies: [
      {
        id: "1-1",
        content: "Je recommande la technique Pomodoro ! 25 minutes de travail, 5 minutes de pause.",
        author: "Alex_M",
        createdAt: "2025-01-10T15:15:00Z"
      }
    ]
  },
  {
    id: "2",
    title: "Cherche colocataire pour appartement près du campus",
    content: "Bonjour ! Je cherche un(e) colocataire pour partager un 2 pièces. Loyer 400€/mois chacun.",
    author: "Tom_K",
    category: "Logement",
    createdAt: "2025-01-09T10:20:00Z",
    replies: []
  }
];

const categories = ["Toutes", "Études", "Logement", "Social", "Jobs", "Divers"];

const categoryColors = {
  "Études": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
  "Logement": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400",
  "Social": "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400",
  "Jobs": "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400",
  "Divers": "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300"
};

const ForumModule = () => {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem("skoolife_forum_posts");
    return saved ? JSON.parse(saved) : initialPosts;
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  // New post form state
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("Études");
  const [newPostAuthor, setNewPostAuthor] = useState("");
  
  // Reply form state
  const [replyContent, setReplyContent] = useState("");
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("skoolife_forum_posts", JSON.stringify(posts));
  }, [posts]);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Toutes" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const createPost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim() || !newPostAuthor.trim()) return;
    
    const newPost: Post = {
      id: Date.now().toString(),
      title: newPostTitle,
      content: newPostContent,
      author: newPostAuthor,
      category: newPostCategory,
      createdAt: new Date().toISOString(),
      replies: []
    };
    
    setPosts([newPost, ...posts]);
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostAuthor("");
    setShowNewPostForm(false);
  };

  const addReply = (postId: string) => {
    if (!replyContent.trim() || !replyAuthor.trim()) return;
    
    const newReply: Reply = {
      id: `${postId}-${Date.now()}`,
      content: replyContent,
      author: replyAuthor,
      createdAt: new Date().toISOString()
    };
    
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, replies: [...post.replies, newReply] }
        : post
    ));
    
    setReplyContent("");
    setReplyAuthor("");
    setReplyingTo(null);
  };

  // Mobile Post Detail View
  const PostDetailView = ({ post }: { post: Post }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setSelectedPost(null)}
          variant="ghost"
          size="sm"
          className="rounded-full p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Discussion</h2>
      </div>

      <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[post.category] || categoryColors["Divers"]}`}>
              {post.category}
            </span>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{post.content}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Réponses ({post.replies.length})
        </h3>
        
        {post.replies.map(reply => (
          <Card key={reply.id} className="border-yellow-200 dark:border-gray-700 bg-yellow-50 dark:bg-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">{reply.author}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(reply.createdAt)}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{reply.content}</p>
            </CardContent>
          </Card>
        ))}
        
        {/* Reply Form */}
        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Répondre à cette discussion</h4>
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Votre nom ou pseudo"
                value={replyAuthor}
                onChange={(e) => setReplyAuthor(e.target.value)}
                className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 touch-manipulation"
              />
              <Textarea
                placeholder="Votre réponse..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 min-h-[100px] touch-manipulation"
              />
              <Button
                onClick={() => addReply(post.id)}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl py-3 font-semibold active:scale-95 transition-all touch-manipulation"
              >
                <Send className="h-4 w-4 mr-2" />
                Publier la réponse
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto p-3 sm:p-4 lg:p-6">
        <PostDetailView post={selectedPost} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Forum Étudiant</h2>
        <Button 
          onClick={() => setShowNewPostForm(!showNewPostForm)}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold shadow-lg transition-all duration-200 rounded-full sm:rounded-lg px-6 py-3 active:scale-95 touch-manipulation"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showNewPostForm ? "Annuler" : "Nouveau Post"}
        </Button>
      </div>

      {/* Mobile-Optimized Search and Filter */}
      <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Rechercher dans le forum..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-xl py-3 touch-manipulation"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 touch-manipulation active:scale-95 ${
                    selectedCategory === category
                      ? "bg-yellow-400 text-gray-900 shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Post Form */}
      {showNewPostForm && (
        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Créer un nouveau post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="Votre nom ou pseudo"
              value={newPostAuthor}
              onChange={(e) => setNewPostAuthor(e.target.value)}
              className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-xl py-3 touch-manipulation"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                type="text"
                placeholder="Titre du post"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="sm:col-span-2 border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-xl py-3 touch-manipulation"
              />
              <select
                value={newPostCategory}
                onChange={(e) => setNewPostCategory(e.target.value)}
                className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-gray-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-yellow-400 focus:outline-none touch-manipulation"
              >
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <Textarea
              placeholder="Contenu de votre message..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white min-h-[120px] rounded-xl touch-manipulation"
            />
            <Button 
              onClick={createPost}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-xl py-3 active:scale-95 transition-all touch-manipulation"
            >
              <Send className="w-4 h-4 mr-2" />
              Publier
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Mobile-Optimized Posts List */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <Card 
            key={post.id} 
            className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all cursor-pointer active:scale-[0.98] touch-manipulation"
            onClick={() => setSelectedPost(post)}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[post.category] || categoryColors["Divers"]}`}>
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <User className="h-3 w-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
                
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base line-clamp-2">
                  {post.content}
                </p>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.replies.length} réponse{post.replies.length !== 1 ? 's' : ''}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-full px-4 py-2"
                  >
                    Voir plus
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredPosts.length === 0 && (
          <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Aucun post trouvé</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
                Soyez le premier à créer un post dans cette catégorie !
              </p>
              <Button
                onClick={() => setShowNewPostForm(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full px-6 py-3"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer un post
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ForumModule;
