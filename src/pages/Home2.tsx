import { useEffect } from "react";
import Header3 from "../components/Header3";
import HeroSection from "../components/hero-section";
import FeaturesSection from "../components/features-section";
import AIAgentsSection from "../components/ai-agents-section";
import ComparisonSection from "../components/comparison-section";
import ContactSection from "../components/contact-section";
import StatsSection from "../components/stats-section";
import ChatBot from "../components/ChatBot";

export default function Home2() {
  useEffect(() => {
    // Check if there's a hash in the URL and scroll to that section
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100); // Small delay to ensure the page is fully rendered
    }
  }, []);

  return (
    <div className="flex w-full h-full flex-col bg-white">
      <Header3 />
      {/* Hero Section - full width, full height */}
      <div className="w-full bg-white">
        <HeroSection />
      </div>
      {/* Features Section - full width, content constrained */}
      <div className="w-full bg-white">
        <FeaturesSection />
      </div>
      {/* AI Agents Section - full width, content constrained */}
      <div className="w-full bg-white">
        <AIAgentsSection />
      </div>
      {/* Stats Section - now a reusable component */}
      <StatsSection />
      {/* Comparison Section - full width, content constrained */}
      <div className="w-full bg-white pt-20">
        <ComparisonSection />
      </div>
      {/* Contact Section - full width, content constrained */}
      <div className="w-full bg-white pt-20">
        <ContactSection />
      </div>
      <ChatBot />
    </div>
  );
}
