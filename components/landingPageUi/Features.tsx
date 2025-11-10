"use client"
import {
  PenTool,
  Search,
  Heart,
  Archive,
  Smartphone,
  Zap,
  Users,
  Shield
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <PenTool className="h-8 w-8" />,
      title: "Seamless Writing",
      description: "Create beautiful blog posts with our intuitive editor. Focus on your content while we handle the formatting."
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Smart Search",
      description: "Find exactly what you're looking for with our powerful search and filtering system across all your posts."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Engage & Connect",
      description: "Like posts that inspire you and build your personal collection of favorite content from the community."
    },
    {
      icon: <Archive className="h-8 w-8" />,
      title: "Organize Effortlessly",
      description: "Archive posts to keep your active feed clean while maintaining access to your entire writing history."
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Fully Responsive",
      description: "Write and read on any device. Postly looks and works perfectly on desktop, tablet, and mobile."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Built with performance in mind. Enjoy instant loading and smooth interactions throughout the app."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Driven",
      description: "Share insights, discover new perspectives, and connect with like-minded writers and readers."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Your Content, Your Control",
      description: "Full ownership of your posts with robust privacy controls and content management tools."
    }
  ];

  return (
    <section className="py-20" id="features">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Share Your Story
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Postly combines powerful features with elegant design to give you the perfect platform for your thoughts and ideas.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="text-gray-900 mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;