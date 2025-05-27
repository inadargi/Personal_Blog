import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PostCard from "@/components/PostCard";
import PostEditor from "@/components/PostEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import type { Post } from "@shared/schema";

export default function Home() {
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Latest");

  const { data: featuredPosts = [], isLoading: featuredLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts/featured"],
  });

  const { data: allPosts = [], isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts", searchQuery, selectedCategory, "published"],
    queryFn: async () => {
      const params = new URLSearchParams({
        status: "published"
      });
      
      if (selectedCategory && selectedCategory !== "All Categories") {
        params.append("category", selectedCategory);
      }
      
      if (searchQuery && searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }
      
      const response = await fetch(`/api/posts?${params.toString()}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      
      return response.json();
    },
  });

  // Sort posts based on selected option
  const sortedPosts = [...allPosts].sort((a, b) => {
    switch (sortBy) {
      case "Most Popular":
        return b.likes - a.likes;
      case "Oldest":
        const dateA = a.publishedAt || a.createdAt;
        const dateB = b.publishedAt || b.createdAt;
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      case "Latest":
      default:
        const latestDateA = a.publishedAt || a.createdAt;
        const latestDateB = b.publishedAt || b.createdAt;
        return new Date(latestDateB).getTime() - new Date(latestDateA).getTime();
    }
  });

  const categories = ["All Categories", "Technology", "Development", "Design", "Business", "Security"];

  const handleNewPost = () => {
    setEditingPost(null);
    setShowEditor(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onNewPost={handleNewPost} />
      <HeroSection onStartWriting={handleNewPost} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Featured Posts</h2>
            <a href="#all-posts" className="text-primary hover:text-blue-700 font-medium">
              View all <i className="fas fa-arrow-right ml-1"></i>
            </a>
          </div>
          
          {featuredLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                  <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onEdit={handleEditPost}
                  featured 
                />
              ))}
            </div>
          )}
        </section>

        {/* All Posts Section */}
        <section id="all-posts">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">All Posts</h2>
              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <span>Showing {sortedPosts.length} posts</span>
                {(searchQuery || selectedCategory !== "All Categories") && (
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                    Filtered
                  </span>
                )}
              </div>
            </div>
            
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 filter-glass p-4 rounded-xl">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64 bg-white/50 border-white/20 focus:bg-white transition-all"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 bg-white/50 border-white/20 transition-all hover:bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40 bg-white/50 border-white/20 transition-all hover:bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Latest">Latest</SelectItem>
                  <SelectItem value="Most Popular">Most Popular</SelectItem>
                  <SelectItem value="Oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
              {(searchQuery || selectedCategory !== "All Categories") && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Categories");
                  }}
                  className="bg-white/50 border-white/20 hover:bg-white text-slate-600"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Posts Grid */}
          {postsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                  <div className="h-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No posts found</h3>
              <p className="text-slate-600 text-lg mb-6">
                {searchQuery || selectedCategory !== "All Categories" 
                  ? "Try adjusting your search or filter criteria." 
                  : "Start creating amazing content for your readers!"
                }
              </p>
              <Button onClick={handleNewPost} className="bg-primary text-white px-8 py-3">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Post
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onEdit={handleEditPost}
                />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {sortedPosts.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" className="px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white">
                Load More Posts
              </Button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-slate-800">TechInsight</span>
                  <span className="text-xs text-slate-500">Professional Blog</span>
                </div>
              </div>
              <p className="text-slate-600 mb-6 max-w-md">
                A professional platform for technology insights, development tutorials, and industry analysis. Stay informed with expert content and cutting-edge perspectives.
              </p>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                  <i className="fab fa-github"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="/" className="text-slate-600 hover:text-primary transition-colors">Home</a></li>
                <li><a href="#all-posts" className="text-slate-600 hover:text-primary transition-colors">All Posts</a></li>
                <li><a href="/categories" className="text-slate-600 hover:text-primary transition-colors">Categories</a></li>
                <li><a href="/about" className="text-slate-600 hover:text-primary transition-colors">About</a></li>
                <li><a href="/contact" className="text-slate-600 hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-600 hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="text-slate-600 hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-600 hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-slate-600 hover:text-primary transition-colors">Community Guidelines</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 mt-8 text-center">
            <p className="text-slate-500">&copy; 2023 BlogCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Post Editor Modal */}
      {showEditor && (
        <PostEditor
          post={editingPost}
          onClose={() => setShowEditor(false)}
          onSave={() => setShowEditor(false)}
        />
      )}
    </div>
  );
}
