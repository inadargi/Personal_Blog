import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/Header";
import PostEditor from "@/components/PostEditor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Heart, Edit, Calendar, Clock, User } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Post } from "@shared/schema";

export default function PostDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [showEditor, setShowEditor] = useState(false);
  const { toast } = useToast();

  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ["/api/posts", id],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Post not found");
      }
      return response.json();
    },
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/posts/${id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Post liked!",
        description: "Thanks for your feedback.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleEdit = () => {
    setShowEditor(true);
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "Draft";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onNewPost={() => {}} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onNewPost={() => {}} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Post Not Found</h1>
            <p className="text-slate-600 mb-8">The post you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => setLocation("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNewPost={() => setShowEditor(true)} />
      
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/")}
          className="mb-8 p-0 h-auto font-normal text-slate-600 hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all posts
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Badge 
                variant="secondary" 
                className={`
                  ${post.category === "Technology" ? "bg-primary/10 text-primary" : ""}
                  ${post.category === "Development" ? "bg-accent/10 text-accent" : ""}
                  ${post.category === "Design" ? "bg-purple-100 text-purple-600" : ""}
                  ${post.category === "Business" ? "bg-green-100 text-green-600" : ""}
                  ${post.category === "Security" ? "bg-red-100 text-red-600" : ""}
                `}
              >
                {post.category}
              </Badge>
              <span className="text-slate-500 text-sm flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {post.readTime}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author and Meta */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  {post.authorAvatar ? (
                    <img 
                      src={post.authorAvatar} 
                      alt={post.authorName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-800">{post.authorName}</p>
                    <p className="text-sm text-slate-500 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(post.publishedAt)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  disabled={likeMutation.isPending}
                  className="flex items-center space-x-2"
                >
                  <Heart className="w-4 h-4" />
                  <span>{post.likes}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-8">
              <img 
                src={post.featuredImage} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
          )}

          <Separator className="mb-8" />

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleLike}
              disabled={likeMutation.isPending}
              className="flex items-center space-x-2"
            >
              <Heart className="w-5 h-5" />
              <span>Like this post ({post.likes})</span>
            </Button>
            
            <Button onClick={() => setLocation("/")} variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all posts
            </Button>
          </div>
        </div>
      </article>

      {/* Post Editor Modal */}
      {showEditor && (
        <PostEditor
          post={post}
          onClose={() => setShowEditor(false)}
          onSave={() => setShowEditor(false)}
        />
      )}
    </div>
  );
}
