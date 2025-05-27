import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { Heart, Edit, Trash2, User, Calendar, Clock } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Post } from "@shared/schema";

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  featured?: boolean;
}

export default function PostCard({ post, onEdit, featured = false }: PostCardProps) {
  const [, setLocation] = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { toast } = useToast();

  const likeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/posts/${post.id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/featured"] });
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

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/posts/${post.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/featured"] });
      toast({
        title: "Post deleted",
        description: "The post has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeMutation.mutate();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(post);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
    setShowDeleteModal(false);
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "Draft";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technology":
        return "bg-primary/10 text-primary";
      case "Development":
        return "bg-accent/10 text-accent";
      case "Design":
        return "bg-purple-100 text-purple-600";
      case "Business":
        return "bg-green-100 text-green-600";
      case "Security":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <>
      <Card 
        className="bg-white shadow-sm overflow-hidden group cursor-pointer card-hover"
        onClick={() => setLocation(`/post/${post.id}`)}
      >
        {/* Featured Image */}
        {post.featuredImage && (
          <div className={`w-full ${featured ? "h-48" : "h-40"} overflow-hidden`}>
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <CardContent className="p-6">
          {/* Category and Read Time */}
          <div className="flex items-center space-x-2 mb-3">
            <Badge className={getCategoryColor(post.category)}>
              {post.category}
            </Badge>
            <span className="text-slate-500 text-sm flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {post.readTime}
            </span>
          </div>

          {/* Title */}
          <h3 className={`${featured ? "text-xl" : "text-lg"} font-semibold text-slate-800 mb-3 group-hover:text-primary transition-colors`}>
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className={`text-slate-600 mb-4 ${featured ? "text-sm line-clamp-3" : "text-sm line-clamp-2"}`}>
            {post.excerpt}
          </p>

          {/* Author and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {post.authorAvatar ? (
                <img 
                  src={post.authorAvatar} 
                  alt={post.authorName}
                  className={`${featured ? "w-8 h-8" : "w-6 h-6"} rounded-full object-cover`}
                />
              ) : (
                <div className={`${featured ? "w-8 h-8" : "w-6 h-6"} rounded-full bg-primary/10 flex items-center justify-center`}>
                  <User className={`${featured ? "w-4 h-4" : "w-3 h-3"} text-primary`} />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-slate-800">{post.authorName}</p>
                <p className="text-xs text-slate-500 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(post.publishedAt)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Actions */}
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="p-1 h-auto text-slate-400 hover:text-primary"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="p-1 h-auto text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Like Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={likeMutation.isPending}
                className="flex items-center space-x-1 text-slate-400 hover:text-red-500 p-1"
              >
                <Heart className={`w-4 h-4 ${featured ? "" : "text-xs"}`} />
                <span className={`${featured ? "text-sm" : "text-xs"}`}>{post.likes}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
