import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/Header";
import PostEditor from "@/components/PostEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Send,
  MessageCircle,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [showEditor, setShowEditor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Message sent successfully!",
      description: "Thank you for reaching out. I'll get back to you soon.",
    });

    form.reset();
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "inadargi@gmail.com",
      description: "Send me an email anytime",
    },
    {
      icon: MapPin,
      title: "Location",
      content: "Maharashtra India",
      description: "Available for remote work",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+1 (555) 123-4567",
      description: "Available during business hours",
    },
    {
      icon: Clock,
      title: "Response Time",
      content: "24-48 hours",
      description: "Typical response time",
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      name: "GitHub",
      url: "#",
      color: "hover:text-gray-700",
    },
    {
      icon: Twitter,
      name: "Twitter",
      url: "#",
      color: "hover:text-blue-500",
    },
    {
      icon: Linkedin,
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/isha-nadargi-399863245/",
      color: "hover:text-blue-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNewPost={() => setShowEditor(true)} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Let's <span className="gradient-text">Connect</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Have a question, collaboration idea, or just want to say hello? I'd
            love to hear from you. Drop me a message and let's start a
            conversation.
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <MessageCircle className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-slate-800">
                  Send a Message
                </h2>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your.email@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="What's this about?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell me more about your project or question..."
                            className="resize-none"
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-3 bg-primary text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                Get in Touch
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">
                        {info.title}
                      </h4>
                      <p className="text-slate-700 font-medium">
                        {info.content}
                      </p>
                      <p className="text-sm text-slate-500">
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Social Links */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                Follow Me
              </h3>
              <div className="space-y-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className={`flex items-center space-x-3 text-slate-600 transition-colors ${social.color}`}
                  >
                    <social.icon className="w-5 h-5" />
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </Card>

            {/* Quick Response */}
            <Card className="p-6 bg-gradient-to-br from-primary to-blue-700 text-white">
              <h3 className="text-xl font-bold mb-3">Quick Response</h3>
              <p className="text-blue-100 mb-4 text-sm">
                For urgent matters or quick questions, feel free to reach out
                directly via email.
              </p>
              <Button
                variant="secondary"
                className="w-full bg-white text-primary hover:bg-blue-50"
                onClick={() =>
                  (window.location.href = "mailto:alex@example.com")
                }
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Directly
              </Button>
            </Card>

            {/* FAQ */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                Common Questions
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">
                    How quickly do you respond?
                  </h4>
                  <p className="text-slate-600 text-sm mt-1">
                    Usually within 24-48 hours during business days.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">
                    Do you take on freelance projects?
                  </h4>
                  <p className="text-slate-600 text-sm mt-1">
                    Yes! I'm always interested in exciting projects and
                    collaborations.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">
                    Can we schedule a call?
                  </h4>
                  <p className="text-slate-600 text-sm mt-1">
                    Absolutely. Send me a message and we can arrange a time to
                    chat.
                  </p>
                </div>
              </div>
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
