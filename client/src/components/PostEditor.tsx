import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { X, Bold, Italic, Underline, List, ListOrdered, Link, Image, Code } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertPostSchema } from "@shared/schema";
import type { Post, InsertPost } from "@shared/schema";
import { z } from "zod";

const formSchema = insertPostSchema.extend({
  tags: z.string().default(""),
});

type FormData = z.infer<typeof formSchema>;

interface PostEditorProps {
  post?: Post | null;
  onClose: () => void;
  onSave: () => void;
}

export default function PostEditor({ post, onClose, onSave }: PostEditorProps) {
  const [content, setContent] = useState(post?.content || "");
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      excerpt: post?.excerpt || "",
      category: post?.category || "",
      tags: post?.tags?.join(", ") || "",
      status: post?.status || "draft",
      readTime: post?.readTime || "",
      featuredImage: post?.featuredImage || "",
      authorName: post?.authorName || "Anonymous",
      authorAvatar: post?.authorAvatar || "",
      likes: post?.likes || 0,
    },
  });

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        category: post.category,
        tags: post.tags?.join(", ") || "",
        status: post.status,
        readTime: post.readTime,
        featuredImage: post.featuredImage || "",
        authorName: post.authorName,
        authorAvatar: post.authorAvatar || "",
        likes: post.likes,
      });
      setContent(post.content);
    }
  }, [post, form]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertPost) => {
      return apiRequest("POST", "/api/posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/featured"] });
      toast({
        title: "Post created",
        description: "Your post has been created successfully.",
      });
      onSave();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<InsertPost>) => {
      return apiRequest("PUT", `/api/posts/${post!.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/featured"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts", post!.id.toString()] });
      toast({
        title: "Post updated",
        description: "Your post has been updated successfully.",
      });
      onSave();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    const postData: InsertPost = {
      ...data,
      content,
      tags: data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
    };

    if (post) {
      updateMutation.mutate(postData);
    } else {
      createMutation.mutate(postData);
    }
  };

  const handleSaveDraft = () => {
    const formData = form.getValues();
    const postData: InsertPost = {
      ...formData,
      content,
      status: "draft",
      tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
    };

    if (post) {
      updateMutation.mutate(postData);
    } else {
      createMutation.mutate(postData);
    }
  };

  const insertHtml = (html: string) => {
    setContent(prev => prev + html);
  };

  const formatText = (command: string) => {
    // Basic rich text formatting
    document.execCommand(command, false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {post ? "Edit Post" : "Create New Post"}
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 p-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">Post Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your post title..." 
                        className="text-lg font-medium"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Meta Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Development">Development</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Security">Security</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="readTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">Read Time</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 5 min read" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Author Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="authorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">Author Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Author name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="authorAvatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">Author Avatar URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Featured Image */}
              <FormField
                control={form.control}
                name="featuredImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">Featured Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Excerpt */}
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">Excerpt</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write a brief description of your post..."
                        className="resize-none"
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Rich Text Editor */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Content</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  {/* Editor Toolbar */}
                  <div className="bg-gray-50 border-b border-gray-300 p-3 flex items-center space-x-2 flex-wrap">
                    <Button 
                      type="button" 
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText("bold")}
                      className="p-2 text-slate-600 hover:bg-white hover:text-primary"
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText("italic")}
                      className="p-2 text-slate-600 hover:bg-white hover:text-primary"
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText("underline")}
                      className="p-2 text-slate-600 hover:bg-white hover:text-primary"
                    >
                      <Underline className="w-4 h-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button 
                      type="button" 
                      variant="ghost"
                      size="sm"
                      onClick={() => insertHtml("<ul><li></li></ul>")}
                      className="p-2 text-slate-600 hover:bg-white hover:text-primary"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost"
                      size="sm"
                      onClick={() => insertHtml("<ol><li></li></ol>")}
                      className="p-2 text-slate-600 hover:bg-white hover:text-primary"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button 
                      type="button" 
                      variant="ghost"
                      size="sm"
                      onClick={() => insertHtml('<a href="">link</a>')}
                      className="p-2 text-slate-600 hover:bg-white hover:text-primary"
                    >
                      <Link className="w-4 h-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost"
                      size="sm"
                      onClick={() => insertHtml('<img src="" alt="" />')}
                      className="p-2 text-slate-600 hover:bg-white hover:text-primary"
                    >
                      <Image className="w-4 h-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost"
                      size="sm"
                      onClick={() => insertHtml('<code></code>')}
                      className="p-2 text-slate-600 hover:bg-white hover:text-primary"
                    >
                      <Code className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Editor Content Area */}
                  <div className="p-6 min-h-[300px] bg-white">
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Start writing your post content..."
                      className="w-full min-h-[250px] border-none outline-none resize-none text-slate-700 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">Tags</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter tags separated by commas..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <Button 
            type="button"
            variant="ghost"
            onClick={handleSaveDraft}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            Save as Draft
          </Button>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-primary text-white hover:bg-blue-700 font-semibold"
            >
              {post ? "Update Post" : "Publish Post"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
