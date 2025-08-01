import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold text-white">Pixel8 Social Hub</h1>
          <Link to="/dashboard">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Enter Dashboard
            </Button>
          </Link>
        </nav>

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold text-white">
              Manage All Your Social Media
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                In One Powerful Hub
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Schedule posts, analyze performance, and collaborate with your team across all major social platforms from a single dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/design-system">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                View Design System
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <Sparkles className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">AI-Powered</h3>
              <p className="text-gray-300">Smart content suggestions and automated scheduling powered by advanced AI.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <Zap className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-300">Publish to all platforms instantly with our optimized posting engine.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <Shield className="h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Enterprise Security</h3>
              <p className="text-gray-300">Bank-level encryption and compliance with all major data protection standards.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;