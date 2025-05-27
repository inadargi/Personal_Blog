import { Button } from "@/components/ui/button";
import { Menu, Search, Plus } from "lucide-react";
import { useLocation } from "wouter";

interface HeaderProps {
  onNewPost: () => void;
}

export default function Header({ onNewPost }: HeaderProps) {
  const [location] = useLocation();

  const isActivePage = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">TechInsight</span>
              <span className="text-xs text-muted-foreground -mt-1">Professional Blog</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="/" 
              className={`transition-colors font-medium ${
                isActivePage("/") 
                  ? "text-primary border-b-2 border-primary pb-1" 
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              Home
            </a>
            <a 
              href="/categories" 
              className={`transition-colors font-medium ${
                isActivePage("/categories") 
                  ? "text-primary border-b-2 border-primary pb-1" 
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              Categories
            </a>
            <a 
              href="/about" 
              className={`transition-colors font-medium ${
                isActivePage("/about") 
                  ? "text-primary border-b-2 border-primary pb-1" 
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              About
            </a>
            <a 
              href="/contact" 
              className={`transition-colors font-medium ${
                isActivePage("/contact") 
                  ? "text-primary border-b-2 border-primary pb-1" 
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              Contact
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="hidden sm:flex items-center space-x-2 text-slate-600 hover:text-primary"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Button>
            <Button 
              onClick={onNewPost}
              className="bg-primary text-white hover:bg-blue-700 font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden text-slate-600">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
