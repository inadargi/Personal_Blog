import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import PostEditor from "@/components/PostEditor";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Palette, Shield, Briefcase, Cpu, TrendingUp } from "lucide-react";
import type { Post } from "@shared/schema";

export default function Categories() {
  const [, setLocation] = useLocation();
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: allPosts = [], isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts", { 
      status: "published",
      category: selectedCategory || undefined
    }],
  });

  const categories = [
    {
      name: "Technology",
      icon: Cpu,
      description: "Latest trends in tech, AI, and emerging technologies",
      color: "bg-blue-500",
      posts: allPosts.filter(post => post.category === "Technology").length
    },
    {
      name: "Development",
      icon: Code,
      description: "Programming tutorials, frameworks, and best practices",
      color: "bg-green-500",
      posts: allPosts.filter(post => post.category === "Development").length
    },
    {
      name: "Design",
      icon: Palette,
      description: "UI/UX design principles and creative insights",
      color: "bg-purple-500",
      posts: allPosts.filter(post => post.category === "Design").length
    },
    {
      name: "Business",
      icon: Briefcase,
      description: "Entrepreneurship, strategy, and professional growth",
      color: "bg-orange-500",
      posts: allPosts.filter(post => post.category === "Business").length
    },
    {
      name: "Security",
      icon: Shield,
      description: "Cybersecurity, privacy, and data protection",
      color: "bg-red-500",
      posts: allPosts.filter(post => post.category === "Security").length
    }
  ];

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
  };

  const filteredPosts = selectedCategory 
    ? allPosts.filter(post => post.category === selectedCategory)
    : allPosts;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNewPost={() => setShowEditor(true)} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Explore by <span className="gradient-text">Categories</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Discover content organized by topics that matter to you. From cutting-edge technology 
            to practical development tips, find exactly what you're looking for.
          </p>
        </section>

        {/* Categories Grid */}
        <section className="mb-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card 
                key={category.name}
                className={`cursor-pointer card-hover transition-all duration-300 ${
                  selectedCategory === category.name 
                    ? 'ring-2 ring-primary shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{category.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {category.posts} posts
                        </Badge>
                        {selectedCategory === category.name && (
                          <Badge className="text-xs bg-primary">
                            Selected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Clear Filter */}
        {selectedCategory && (
          <div className="text-center mb-8">
            <Button 
              variant="outline" 
              onClick={() => setSelectedCategory(null)}
              className="px-6 py-2"
            >
              Clear Filter
            </Button>
          </div>
        )}

        {/* Posts Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800">
              {selectedCategory ? `${selectedCategory} Posts` : 'All Posts'}
            </h2>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-slate-500" />
              <span className="text-slate-600">{filteredPosts.length} posts</span>
            </div>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Cpu className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {selectedCategory ? `No ${selectedCategory} posts yet` : 'No posts found'}
              </h3>
              <p className="text-slate-600 mb-6">
                {selectedCategory 
                  ? `Be the first to write about ${selectedCategory}!`
                  : 'Start creating content to fill this space.'
                }
              </p>
              <Button onClick={() => setShowEditor(true)} className="px-8 py-3">
                Create First Post
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onEdit={handleEditPost}
                />
              ))}
            </div>
          )}
        </section>

        {/* Category Statistics */}
        {!selectedCategory && filteredPosts.length > 0 && (
          <section className="mt-16">
            <Card className="p-8 bg-gradient-to-br from-slate-50 to-blue-50">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Content Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {categories.map((category) => (
                  <div key={category.name} className="text-center">
                    <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800">{category.posts}</div>
                    <div className="text-sm text-slate-600">{category.name}</div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}
      </main>

      {/* Post Editor Modal */}
      {showEditor && (
        <PostEditor
          post={editingPost}
          onClose={() => {
            setShowEditor(false);
            setEditingPost(null);
          }}
          onSave={() => {
            setShowEditor(false);
            setEditingPost(null);
          }}
        />
      )}
    </div>
  );
}