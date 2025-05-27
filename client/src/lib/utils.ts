import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null): string {
  if (!date) return "Draft";
  
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return "Just now";
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  return formatDate(date);
}

export function generateExcerpt(content: string, maxLength: number = 150): string {
  // Remove HTML tags
  const plainText = content.replace(/<[^>]*>/g, "");
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).trim() + "...";
}

export function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const plainText = content.replace(/<[^>]*>/g, "");
  const wordCount = plainText.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return `${minutes} min read`;
}
