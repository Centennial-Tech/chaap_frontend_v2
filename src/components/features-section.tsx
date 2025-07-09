import { Bot, Target, Boxes, TrendingUp, RotateCcw, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Bot,
    title: "Smart Automation",
    description: "Each AI agent acts as a specialized assistant planning, generating, validating, and adapting submission materials to meet evolving regulatory expectations."
  },
  {
    icon: Target,
    title: "Precision & Compliance",
    description: "Agents are trained on real-world guidance documents and historical precedents, delivering outputs that are accurate, well-structured, and submission ready."
  },
  {
    icon: Boxes,
    title: "Modular Flexibility",
    description: "Whether you need support for a single submission element or end-to-end compliance, CHAAP adapts to your team's structure and needs with composable agents."
  },
  {
    icon: TrendingUp,
    title: "Scalable Support",
    description: "From startups to enterprise teams and consulting partners, CHAAP offers scalable, AI-driven insights that grow with your product portfolio and regulatory demands."
  },
  {
    icon: RotateCcw,
    title: "Always Up-to-Date",
    description: "Our agents evolve continuously alongside updated guidance and rule changes, ensuring your workflows and deliverables remain aligned without manual effort."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Built with enterprise-grade security and compliance standards to protect your sensitive regulatory data and intellectual property."
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-400 text-[#0b0080] mb-6">
            Centennial Healthcare{" "}
            <span className="text-orange-500">AgenticAI Platform</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Whether you are preparing for premarket pathways, developing technical documentation, or maintaining post-market oversight, CHAAP empowers your team to navigate compliance with clarity, speed, and confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              className={`relative p-8 rounded-2xl shadow-lg border transition-all duration-300 group hover:shadow-[0_35px_70px_-5px_rgba(168,85,247,0.7)] hover:border-purple-300/50 bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200 hover:from-purple-100 hover:to-purple-150 animate-bounce`}
              style={{
                animation: `float 4s ease-in-out infinite`,
                animationDelay: `${idx * 0.5}s`,
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + idx * 0.12, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {/* Card content */}
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br from-[#a855f7] to-[#ff7875] shadow-lg">
                  <feature.icon className="text-white drop-shadow-sm" size={32} />
                </div>
                <h3 className="text-2xl font-500 mb-4 transition-colors duration-300 text-[#0b0080] group-hover:text-purple-700">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-[#0b0080]">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </section>
  );
}
