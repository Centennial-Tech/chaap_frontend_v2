import { ArrowRight } from "lucide-react";
import backgroundVideo from "../assets/video3.mp4";
import { Button } from "./ui/Button";

export default function HeroSection() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full bg-white overflow-hidden min-h-[calc(100vh-5rem)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col xl:flex-row items-center justify-between min-h-[calc(100vh-5rem)]">
        {/* Text Content */}
        <div className="w-full xl:w-1/2 text-center xl:text-left z-10 pt-8 xl:pt-0">
          <div className="inline-block bg-white/60 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-200 xl:self-start">
            ✨ Healthcare AI Revolution
          </div>
          <h1 className="text-5xl xl:text-7xl font-black leading-tight mb-6 text-gray-900">
            AI That Understands{" "}
            <span className="text-gray-900 bg-clip-text">
              Regulation
            </span>
          </h1>
          <p className="text-2xl xl:text-3xl font-bold text-blue-600 mb-4">
            So You Don't Have To.
          </p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto xl:mx-0">
            Streamline regulatory compliance with AI-powered agents that understand healthcare regulations and accelerate your submission processes with unprecedented accuracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start">
            <Button 
              onClick={scrollToContact}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 hover:shadow-2xl shadow-lg"
              size="lg"
            >
              Book A Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={scrollToFeatures}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50"
              size="lg"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Video Container */}
        <div className="w-full xl:w-1/2 mt-8 sm:mt-12 xl:mt-0 flex items-center justify-center xl:justify-end">
          <div className="relative w-full flex items-center justify-center xl:justify-end overflow-visible">
            <video
              autoPlay
              muted
              playsInline
              className="w-[95%] sm:w-[85%] xl:w-auto h-auto transform translate-x-[-5%] scale-90 sm:scale-100 xl:scale-[1.1] xl:translate-x-[-5%]"
              style={{
                background: "white",
              }}
            >
              <source src={backgroundVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
