
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Reply, User, Clock } from "lucide-react";

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
  "Études": "bg-blue-100 text-blue-800 border-blue-200",
  "Logement": "bg-green-100 text-green-800 border-green-200",
  "Social": "bg-purple-100 text-purple-800 border-purple-200",
  "Jobs": "bg-orange-100 text-orange-800 border-orange-200",
  "Divers": "bg-gray-100 text-gray-800 border-gray-200"
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

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Forum Étudiant</h2>
        <Button 
          onClick={() => setShowNewPostForm(!showNewPostForm)}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold shadow-md transition-all duration-200"
        >
          {showNewPostForm ? "Annuler" : "Nouveau Post"}
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              placeholder="Rechercher dans le forum..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-gray-200 rounded-lg px-4 py-2 font-medium focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
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
              className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white"
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="Titre du post"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="flex-1 border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white"
              />
              <select
                value={newPostCategory}
                onChange={(e) => setNewPostCategory(e.target.value)}
                className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-gray-200 rounded-lg px-4 py-2 font-medium focus:ring-2 focus:ring-yellow-400 focus:outline-none"
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
              className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white min-h-[120px]"
            />
            <Button 
              onClick={createPost}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
            >
              Publier
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <Card key={post.id} className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-600 pt-4">
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.replies.length} réponse{post.replies.length !== 1 ? 's' : ''}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-600 dark:text-yellow-400"
                >
                  {expandedPost === post.id ? "Masquer" : "Voir plus"}
                </Button>
              </div>

              {/* Replies */}
              {expandedPost === post.id && (
                <div className="mt-4 space-y-4">
                  {post.replies.map(reply => (
                    <div key={reply.id} className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg border border-yellow-200 dark:border-gray-600 ml-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white">{reply.author}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(reply.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{reply.content}</p>
                    </div>
                  ))}
                  
                  {/* Reply Form */}
                  {replyingTo === post.id ? (
                    <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg border border-yellow-200 dark:border-gray-600 ml-4 space-y-3">
                      <Input
                        type="text"
                        placeholder="Votre nom ou pseudo"
                        value={replyAuthor}
                        onChange={(e) => setReplyAuthor(e.target.value)}
                        className="border-yellow-300 dark:border-gray-500 bg-white dark:bg-gray-600"
                      />
                      <Textarea
                        placeholder="Votre réponse..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="border-yellow-300 dark:border-gray-500 bg-white dark:bg-gray-600"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => addReply(post.id)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                        >
                          Répondre
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setReplyingTo(null)}
                          className="border-gray-300"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReplyingTo(post.id)}
                      className="ml-4 border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-600 dark:text-yellow-400"
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Répondre
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {filteredPosts.length === 0 && (
          <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">Aucun post trouvé. Soyez le premier à créer un post !</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ForumModule;
