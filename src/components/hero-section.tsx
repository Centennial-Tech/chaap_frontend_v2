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
    <section className="relative w-full  overflow-hidden min-h-[calc(100vh-5rem)] bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between min-h-[calc(100vh-5rem)]">
        {/* Text Content */}
        <div className="w-full px-4 md:px-8 lg:ml-4 lg:px-0 lg:w-1/2 text-center lg:text-left z-10 pt-8 lg:pt-0">
          <div className="inline-block bg-white/60 text-purple-500 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-purple-500 lg:self-start">
            ✨ Healthcare AI Revolution
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-400 leading-tight mb-6 text-[#0b0080]">
            AI That Understands{" "}
            <span className="text-[#0b0080] bg-clip-text">
              Regulation
            </span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-2xl xl:text-3xl font-bold text-purple-500 mb-4">
            So You Don't Have To.
          </p>
          <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0">
            Streamline regulatory compliance with AI-powered agents that understand healthcare regulations and accelerate your submission processes with unprecedented accuracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start">
            <Button 
              onClick={scrollToContact}
              className="bg-purple-500 hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 hover:shadow-2xl shadow-lg"
              size="lg"
            >
              Book A Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={scrollToFeatures}
              variant="outline"
              className="border-purple-500 text-purple-500 hover:border-purple-500 hover:text-purple-500 hover:bg-purple-50"
              size="lg"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Video Container */}
        <div className="w-full lg:w-1/2 mt-8 lg:mt-0 flex items-center justify-center lg:justify-end px-4 md:px-8 lg:px-0">
          <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-none flex items-center justify-center lg:justify-end overflow-visible">
            <video
              autoPlay
              muted
              playsInline
              className="w-full sm:w-[90%] md:w-[85%] lg:w-auto h-auto transform scale-90 sm:scale-95 md:scale-100 lg:scale-[1.3] xl:scale-[1.1] lg:translate-x-[-5%]"
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
