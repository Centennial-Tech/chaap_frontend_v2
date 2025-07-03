import { ArrowRight } from "lucide-react";

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
    <section className="relative w-full bg-white text-gray-900 overflow-hidden flex items-center justify-center pb-24 min-h-[calc(100vh-5rem)]">
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="text-center">
          <div className="inline-block bg-white/60 backdrop-blur-sm text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-200">
            ✨ Healthcare AI Revolution
          </div>
          <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6 text-gray-900 max-w-5xl mx-auto">
            AI That Understands{" "}
            <span className="text-gray-900 bg-clip-text">
              Regulation
            </span>
          </h1>
          <p className="text-2xl lg:text-3xl font-bold text-blue-600 mb-4">
            So You Don't Have To.
          </p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Streamline regulatory compliance with AI-powered agents that understand healthcare regulations and accelerate your submission processes with unprecedented accuracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={scrollToContact}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg inline-flex items-center justify-center"
            >
              Book A Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button 
              onClick={scrollToFeatures}
              className="border-2 border-blue-600 hover:border-orange-500 text-blue-600 hover:text-orange-500 hover:bg-orange-50 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
