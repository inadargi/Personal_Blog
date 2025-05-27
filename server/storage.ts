import { users, posts, type User, type InsertUser, type Post, type InsertPost, type UpdatePost } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Post operations
  getPosts(filters?: { category?: string; status?: string; search?: string }): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, updates: UpdatePost): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  getFeaturedPosts(): Promise<Post[]>;
  likePost(id: number): Promise<Post | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private currentUserId: number;
  private currentPostId: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.currentUserId = 1;
    this.currentPostId = 1;
    
    // Initialize with some sample posts for demonstration
    this.initializeSamplePosts();
  }

  private initializeSamplePosts() {
    const sampleData = [
      {
        title: "The Future of Remote Work: Trends and Technologies",
        content: "<p>Remote work has evolved significantly over the past few years, driven by technological advances and changing workplace cultures. This comprehensive guide explores the latest trends and technologies shaping the future of distributed teams.</p><p>From virtual reality meeting spaces to AI-powered collaboration tools, we're witnessing a revolution in how teams connect and collaborate across distances. The key is understanding which technologies truly enhance productivity and which are merely novelties.</p><p>Companies are investing heavily in digital transformation initiatives that support remote teams. Cloud computing, project management tools, and communication platforms have become the backbone of modern businesses.</p>",
        excerpt: "Exploring how remote work is evolving and the technologies that are making it more efficient and collaborative...",
        category: "Technology",
        tags: ["remote work", "technology", "collaboration", "future"],
        status: "published",
        readTime: "5 min read",
        featuredImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
        authorName: "Viransh Sharma",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        likes: 24,
        publishedDate: new Date("2023-12-15"),
      },
      {
        title: "Building Scalable React Applications: Best Practices",
        content: "<p>Creating React applications that scale with your team and user base requires careful planning and adherence to proven patterns. This guide covers the essential practices for building maintainable React applications.</p><p>We'll explore component architecture, state management strategies, performance optimization techniques, and testing methodologies that will help your application grow sustainably.</p><p>From code splitting to state management, every decision impacts your app's scalability. Learn how to make the right choices from the start.</p>",
        excerpt: "Learn the essential patterns and practices for building maintainable React applications that scale with your team...",
        category: "Development",
        tags: ["react", "javascript", "best practices", "scalability"],
        status: "published",
        readTime: "8 min read",
        featuredImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
        authorName: "Sarah Chen",
        authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        likes: 42,
        publishedDate: new Date("2023-12-12"),
      },
      {
        title: "UI/UX Design Principles for Modern Web Applications",
        content: "<p>Great user experience is the foundation of successful web applications. This article explores the fundamental design principles that create intuitive and beautiful user interfaces.</p><p>We'll cover visual hierarchy, color theory, typography, responsive design, and accessibility considerations that ensure your application works for everyone.</p><p>Design systems have become crucial for maintaining consistency across large applications. Learn how to create and implement effective design systems.</p>",
        excerpt: "Discover the fundamental design principles that create intuitive and beautiful user experiences...",
        category: "Design",
        tags: ["ui", "ux", "design", "principles"],
        status: "published",
        readTime: "6 min read",
        featuredImage: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e",
        authorName: "Mike Rodriguez",
        authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        likes: 38,
        publishedDate: new Date("2023-12-10"),
      },
      {
        title: "Cybersecurity Best Practices for Modern Businesses",
        content: "<p>In today's digital landscape, cybersecurity has become a critical concern for businesses of all sizes. This comprehensive guide covers essential security practices that every organization should implement to protect their digital assets.</p><p>From multi-factor authentication to regular security audits, we'll explore the key strategies that can help prevent data breaches and cyber attacks.</p><p>Learn about the latest threats including phishing attacks, ransomware, and social engineering tactics that cybercriminals use to compromise business systems.</p>",
        excerpt: "Essential cybersecurity practices every business needs to implement to protect against modern threats...",
        category: "Security",
        tags: ["cybersecurity", "data protection", "business", "privacy"],
        status: "published",
        readTime: "7 min read",
        featuredImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
        authorName: "David Kim",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        likes: 31,
        publishedDate: new Date("2023-12-08"),
      },
      {
        title: "Entrepreneurship in the Digital Age: Building Your Startup",
        content: "<p>Starting a business in today's digital-first world presents unique opportunities and challenges. This guide provides practical advice for aspiring entrepreneurs looking to build successful startups.</p><p>We'll cover everything from validating your business idea to scaling your operations, with insights from successful founders who've navigated the startup journey.</p><p>Digital tools and platforms have democratized entrepreneurship, making it easier than ever to start a business with minimal upfront investment.</p>",
        excerpt: "A comprehensive guide for aspiring entrepreneurs on building successful startups in the digital age...",
        category: "Business",
        tags: ["entrepreneurship", "startup", "business strategy", "digital transformation"],
        status: "published",
        readTime: "9 min read",
        featuredImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd",
        authorName: "Emma Thompson",
        authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786",
        likes: 56,
        publishedDate: new Date("2023-12-05"),
      },
      {
        title: "Machine Learning for Beginners: Getting Started with AI",
        content: "<p>Artificial Intelligence and Machine Learning are transforming industries across the globe. This beginner-friendly guide introduces the fundamental concepts and practical applications of ML.</p><p>Learn about different types of machine learning algorithms, from supervised learning to neural networks, and discover how they're being used to solve real-world problems.</p><p>We'll also explore the tools and frameworks that make machine learning accessible to developers of all skill levels.</p>",
        excerpt: "An accessible introduction to machine learning concepts and practical applications for beginners...",
        category: "Technology",
        tags: ["machine learning", "ai", "programming", "data science"],
        status: "published",
        readTime: "10 min read",
        featuredImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
        authorName: "Dr. Lisa Park",
        authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
        likes: 73,
        publishedDate: new Date("2023-12-03"),
      },
      {
        title: "Advanced CSS Techniques: Creating Stunning Web Animations",
        content: "<p>CSS has evolved far beyond simple styling. Modern CSS offers powerful animation capabilities that can create engaging user experiences without JavaScript.</p><p>This tutorial explores advanced CSS techniques including keyframes, transforms, transitions, and CSS Grid animations.</p><p>Learn how to create smooth, performant animations that enhance user interaction while maintaining excellent performance across all devices.</p>",
        excerpt: "Master advanced CSS animation techniques to create engaging and performant web experiences...",
        category: "Development",
        tags: ["css", "animations", "frontend", "web development"],
        status: "published",
        readTime: "6 min read",
        featuredImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        authorName: "Carlos Martinez",
        authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        likes: 45,
        publishedDate: new Date("2023-12-01"),
      },
      {
        title: "Color Psychology in Digital Design: Creating Emotional Connections",
        content: "<p>Colors have a profound psychological impact on users and can significantly influence their behavior and emotions. This article explores how to use color psychology effectively in digital design.</p><p>We'll examine the psychological associations of different colors and how leading brands use color to communicate their values and connect with their audience.</p><p>Learn practical techniques for choosing color palettes that support your design goals and create the desired emotional response.</p>",
        excerpt: "Understand how color psychology can enhance your digital designs and create stronger emotional connections...",
        category: "Design",
        tags: ["color theory", "psychology", "branding", "digital design"],
        status: "published",
        readTime: "7 min read",
        featuredImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab",
        authorName: "Nina Williams",
        authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        likes: 39,
        publishedDate: new Date("2023-11-28"),
      },
      {
        title: "Data Privacy Laws: What Every Business Owner Should Know",
        content: "<p>With the implementation of GDPR, CCPA, and other privacy regulations, businesses must prioritize data protection to avoid hefty fines and maintain customer trust.</p><p>This comprehensive guide breaks down the key privacy laws affecting businesses today and provides practical steps for compliance.</p><p>Learn about data collection best practices, user consent requirements, and how to implement privacy-by-design principles in your business operations.</p>",
        excerpt: "Navigate the complex landscape of data privacy laws and ensure your business stays compliant...",
        category: "Security",
        tags: ["privacy", "gdpr", "compliance", "data protection"],
        status: "published",
        readTime: "8 min read",
        featuredImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3",
        authorName: "Jennifer Adams",
        authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786",
        likes: 28,
        publishedDate: new Date("2023-11-25"),
      },
      {
        title: "Building a Personal Brand: Social Media Strategies That Work",
        content: "<p>In today's digital world, building a strong personal brand is essential for career growth and business success. This guide provides actionable strategies for establishing your online presence.</p><p>Learn how to develop a consistent brand voice, create engaging content, and leverage different social media platforms to reach your target audience.</p><p>We'll also cover common mistakes to avoid and how to measure the success of your personal branding efforts.</p>",
        excerpt: "Develop a powerful personal brand with proven social media strategies and content creation techniques...",
        category: "Business",
        tags: ["personal branding", "social media", "marketing", "career development"],
        status: "published",
        readTime: "8 min read",
        featuredImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71",
        authorName: "Marcus Johnson",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        likes: 67,
        publishedDate: new Date("2023-11-22"),
      }
    ];

    sampleData.forEach(({ publishedDate, ...postData }) => {
      this.createPostWithDate(postData as InsertPost, publishedDate);
    });
  }

  private createPostWithDate(insertPost: InsertPost, publishedDate: Date): Post {
    const id = this.currentPostId++;
    const now = new Date();
    const post: Post = {
      id,
      title: insertPost.title,
      content: insertPost.content,
      excerpt: insertPost.excerpt,
      category: insertPost.category,
      tags: insertPost.tags || [],
      status: insertPost.status || "draft",
      readTime: insertPost.readTime,
      featuredImage: insertPost.featuredImage || null,
      authorName: insertPost.authorName,
      authorAvatar: insertPost.authorAvatar || null,
      likes: insertPost.likes || 0,
      publishedAt: insertPost.status === "published" ? publishedDate : null,
      createdAt: now,
      updatedAt: now,
    };
    this.posts.set(id, post);
    return post;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPosts(filters?: { category?: string; status?: string; search?: string }): Promise<Post[]> {
    let postsArray = Array.from(this.posts.values());
    
    // Filter by status (default to published if not specified)
    const statusFilter = filters?.status || "published";
    postsArray = postsArray.filter(post => post.status === statusFilter);
    
    // Filter by category
    if (filters?.category && filters.category !== "All Categories") {
      postsArray = postsArray.filter(post => 
        post.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }
    
    // Filter by search term
    if (filters?.search && filters.search.trim()) {
      const searchLower = filters.search.toLowerCase().trim();
      postsArray = postsArray.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort by publishedAt descending (newest first)
    return postsArray.sort((a, b) => {
      const dateA = a.publishedAt || a.createdAt;
      const dateB = b.publishedAt || b.createdAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }

  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const now = new Date();
    const post: Post = {
      id,
      title: insertPost.title,
      content: insertPost.content,
      excerpt: insertPost.excerpt,
      category: insertPost.category,
      tags: insertPost.tags || [],
      status: insertPost.status || "draft",
      readTime: insertPost.readTime,
      featuredImage: insertPost.featuredImage || null,
      authorName: insertPost.authorName,
      authorAvatar: insertPost.authorAvatar || null,
      likes: insertPost.likes || 0,
      publishedAt: insertPost.status === "published" ? now : null,
      createdAt: now,
      updatedAt: now,
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: number, updates: UpdatePost): Promise<Post | undefined> {
    const existingPost = this.posts.get(id);
    if (!existingPost) return undefined;
    
    const now = new Date();
    const updatedPost: Post = {
      ...existingPost,
      ...updates,
      updatedAt: now,
      publishedAt: updates.status === "published" && existingPost.status !== "published" 
        ? now 
        : existingPost.publishedAt,
    };
    
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    return this.posts.delete(id);
  }

  async getFeaturedPosts(): Promise<Post[]> {
    const publishedPosts = Array.from(this.posts.values())
      .filter(post => post.status === "published")
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 3);
    
    return publishedPosts;
  }

  async likePost(id: number): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const updatedPost: Post = {
      ...post,
      likes: post.likes + 1,
      updatedAt: new Date(),
    };
    
    this.posts.set(id, updatedPost);
    return updatedPost;
  }
}

export const storage = new MemStorage();
