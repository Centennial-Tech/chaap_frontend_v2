import { CheckCircle, Lightbulb, FileText, MessageCircle, Search, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const agents = [
  {
    id: 1,
    name: "Pre-submission Strategy Agent",
    description: "Your AI-powered regulatory strategist",
    icon: Lightbulb,
    iconBg: "bg-gradient-to-br from-sky-300 to-blue-400",
    features: [
      "Identifies optimal submission pathways",
      "Recommends FDA meeting strategies",
      "Generates timeline and resource plans"
    ],
    buttonText: "Try Pre-submission Agent",
    buttonColor: "bg-gradient-to-r from-sky-400 to-blue-500"
  },
  {
    id: 2,
    name: "Document Preparation Agent",
    description: "AI-powered regulatory writing assistant",
    icon: FileText,
    iconBg: "bg-gradient-to-br from-orange-400 to-orange-600",
    features: [
      "Auto-generates compliant content",
      "Validates section completeness",
      "Formats to FDA standards"
    ],
    buttonText: "Try Document Agent",
    buttonColor: "bg-gradient-to-r from-orange-500 to-orange-600"
  },
  {
    id: 3,
    name: "FDA Meeting Prep Agent",
    description: "Prepare for successful FDA interactions",
    icon: MessageCircle,
    iconBg: "bg-gradient-to-br from-purple-400 to-purple-600",
    features: [
      "Creates meeting agendas",
      "Prepares Q&A scenarios",
      "Analyzes past meeting outcomes"
    ],
    buttonText: "Try FDA Agent",
    buttonColor: "bg-gradient-to-r from-purple-500 to-purple-600"
  },
  {
    id: 4,
    name: "Regulatory Knowledge Agent",
    description: "AI-powered regulatory intelligence platform",
    icon: Search,
    iconBg: "bg-gradient-to-br from-pink-400 to-rose-500",
    features: [
      "Real-time regulatory guidance updates",
      "Cross-references FDA databases",
      "Provides contextual recommendations"
    ],
    buttonText: "Try Knowledge Agent",
    buttonColor: "bg-gradient-to-r from-pink-500 to-rose-500"
  },
  {
    id: 5,
    name: "Post-Market Surveillance Agent",
    description: "AI-driven post-market monitoring system",
    icon: Shield,
    iconBg: "bg-gradient-to-br from-sky-300 to-blue-400",
    features: [
      "Monitors adverse events patterns",
      "Generates safety signal reports",
      "Automates regulatory reporting"
    ],
    buttonText: "Try Surveillance Agent",
    buttonColor: "bg-gradient-to-r from-sky-400 to-blue-500"
  }
];

export default function AIAgentsSection() {
  return (
    <section id="ai-agents" className="py-24 bg-white">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            AI Agents
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Transform your regulatory compliance with our specialized AI agents
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {agents.map((agent, idx) => (
            <motion.div
              key={agent.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + idx * 0.12, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              {/* Icon and Title */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className={`${agent.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  <agent.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{agent.name}</h3>
                <p className="text-slate-600 text-sm">{agent.description}</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {agent.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <Link to="/login">
                <button 
                  className={`w-full text-white font-medium ${agent.buttonColor} hover:shadow-lg transition-all duration-300 px-4 py-3 rounded-lg`}
                >
                  {agent.buttonText}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link to="/login">
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 text-lg rounded-lg font-semibold transition-all duration-300">
              Explore All AI Agents
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
