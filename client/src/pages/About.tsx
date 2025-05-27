import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import PostEditor from "@/components/PostEditor";
import {
  Heart,
  Users,
  BookOpen,
  Award,
  Mail,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";

export default function About() {
  const [showEditor, setShowEditor] = useState(false);

  const stats = [
    { icon: BookOpen, label: "Posts Published", value: "50+" },
    { icon: Users, label: "Monthly Readers", value: "10K+" },
    { icon: Heart, label: "Total Likes", value: "1.2K+" },
    { icon: Award, label: "Featured Articles", value: "15" },
  ];

  const skills = [
    "Frontend Development",
    "React & Next.js",
    "TypeScript",
    "UI/UX Design",
    "Technical Writing",
    "Web Performance",
    "Accessibility",
    "Modern CSS",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNewPost={() => setShowEditor(true)} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="relative inline-block">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
              alt="Author"
              className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-white shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Hi, I'm <span className="gradient-text">Viransh Sharma</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            A passionate developer and technical writer sharing insights about
            modern web development, emerging technologies, and best practices in
            software engineering.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button className="bg-primary text-white px-8 py-3">
              <Mail className="w-4 h-4 mr-2" />
              Get in Touch
            </Button>
            <Button variant="outline" className="px-8 py-3">
              <BookOpen className="w-4 h-4 mr-2" />
              Read My Work
            </Button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6 card-hover">
                <CardContent className="p-0">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-slate-800 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* About Content */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="p-8 mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">
                My Story
              </h2>
              <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>
                  I started my journey in web development over 3 years ago,
                  driven by curiosity and a passion for creating meaningful
                  digital experiences. What began as a hobby quickly evolved
                  into a career focused on building scalable, user-centered
                  applications.
                </p>
                <p>
                  Throughout my career, I've had the privilege of working with
                  startups and established companies, helping them bring their
                  visions to life through thoughtful design and robust
                  engineering. I believe in the power of sharing knowledge,
                  which led me to start this blog as a platform to discuss the
                  latest trends, best practices, and lessons learned.
                </p>
                <p>
                  When I'm not coding or writing, you can find me exploring new
                  technologies, contributing to open-source projects. I'm always
                  excited to connect with fellow enthusiasts and collaborate on
                  interesting projects.
                </p>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">
                What I Write About
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    Frontend Development
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Deep dives into React, TypeScript, and modern JavaScript
                    frameworks. Performance optimization and best practices.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    UI/UX Design
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Design principles, user experience patterns, and creating
                    interfaces that users love.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    Web Technologies
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Emerging web standards, browser APIs, and the future of web
                    development.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    Career Growth
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Professional development tips, industry insights, and
                    navigating the tech landscape.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Skills */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-primary/10 text-primary"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Social Links */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Connect With Me
              </h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center space-x-3 text-slate-600 hover:text-primary transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span>github.com/Isha_Nadargi</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 text-slate-600 hover:text-primary transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                  <span>@Isha_Nadargi</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 text-slate-600 hover:text-primary transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>linkedin.com/inadargi</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 text-slate-600 hover:text-primary transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>inadargi@gmail.com</span>
                </a>
              </div>
            </Card>

            {/* Newsletter */}
            <Card className="p-6 bg-gradient-to-br from-primary to-blue-700 text-white">
              <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
              <p className="text-blue-100 mb-4 text-sm">
                Get notified when I publish new articles and insights.
              </p>
              <Button
                variant="secondary"
                className="w-full bg-white text-primary hover:bg-blue-50"
              >
                Subscribe to Newsletter
              </Button>
            </Card>
          </div>
        </div>
      </main>

      {/* Post Editor Modal */}
      {showEditor && (
        <PostEditor
          post={null}
          onClose={() => setShowEditor(false)}
          onSave={() => setShowEditor(false)}
        />
      )}
    </div>
  );
}
