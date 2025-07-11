import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/Button";

interface ComingSoonSectionProps {
  pageName: string;
}

const ComingSoonSection = ({ pageName }: ComingSoonSectionProps) => {
  return (
    <section className="relative w-full overflow-hidden min-h-[calc(100vh-5rem)]">
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]"
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block text-purple-500 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-purple-500">
            ✨ Coming Soon
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-400 leading-tight mb-6 text-[#0b0080]">
            {pageName}
          </h1>
          
          <div className="w-20 h-1 bg-purple-500 mx-auto mb-8"></div>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            We're working hard to bring you this exciting new feature. Our team is dedicated to creating innovative solutions that will transform your regulatory compliance experience.
          </p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Button
              asChild
              className="bg-purple-500 hover:bg-purple-600 transform hover:scale-105 shadow-lg"
              size="lg"
            >
              <Link to="/">
                Return Home
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default ComingSoonSection; 