import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onStartWriting: () => void;
}

export default function HeroSection({ onStartWriting }: HeroSectionProps) {
  return (
    <section className="hero-gradient text-white py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Share Your Stories,<br />
          <span className="text-blue-200">Inspire the World</span>
        </h1>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          A modern, elegant platform for writers and readers. Create beautiful blog posts with our intuitive editor and reach your audience.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button 
            onClick={onStartWriting}
            className="bg-white text-primary px-8 py-3 hover:bg-gray-100 font-semibold"
          >
            Start Writing
          </Button>
          <Button 
            variant="outline"
            className="border-2 border-white text-white px-8 py-3 hover:bg-white hover:text-primary font-semibold"
          >
            Explore Posts
          </Button>
        </div>
      </div>
    </section>
  );
}
