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
      "Recommends meeting strategies",
      "Generates timeline and resource plans"
    ],
    buttonText: "Try Pre-submission Agent",
    buttonColor: "bg-gradient-to-r from-sky-400 to-blue-500",
    shadowColor: "hover:shadow-[0_35px_70px_-5px_rgba(56,189,248,0.7)]",
    satisfaction: 94,
    effectiveness: 89,
    accuracy: 91,
    path: "/agents/presubmission-strategy"
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
    buttonColor: "bg-gradient-to-r from-orange-500 to-orange-600",
    shadowColor: "hover:shadow-[0_35px_70px_-5px_rgba(251,146,60,0.7)]",
    satisfaction: 92,
    effectiveness: 95,
    accuracy: 97,
    path: "/agents/document-preparation"
  },
  {
    id: 3,
    name: "Meeting Preparation Agent",
    description: "Prepare for successful interactions",
    icon: MessageCircle,
    iconBg: "bg-gradient-to-br from-purple-400 to-purple-600",
    features: [
      "Creates meeting agendas",
      "Prepares Q&A scenarios",
      "Analyzes past meeting outcomes"
    ],
    buttonText: "Try Meeting Preparation Agent",
    buttonColor: "bg-gradient-to-r from-purple-500 to-purple-600",
    shadowColor: "hover:shadow-[0_35px_70px_-5px_rgba(168,85,247,0.7)]",
    satisfaction: 88,
    effectiveness: 91,
    accuracy: 89,
    path: "/agents/FDA-Meeting-Prep"
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
    buttonColor: "bg-gradient-to-r from-pink-500 to-rose-500",
    shadowColor: "hover:shadow-[0_35px_70px_-5px_rgba(244,114,182,0.7)]",
    satisfaction: 96,
    effectiveness: 93,
    accuracy: 95,
    path: "/agents/regulatory-knowledge"
  },
  {
    id: 5,
    name: "Post-Market Surveillance Agent",
    description: "AI-driven post-market monitoring system",
    icon: Shield,
    iconBg: "bg-gradient-to-br from-blue-600 to-blue-800",
    features: [
      "Monitors adverse events patterns",
      "Generates safety signal reports",
      "Automates regulatory reporting"
    ],
    buttonText: "Try Surveillance Agent",
    buttonColor: "bg-gradient-to-r from-blue-600 to-blue-700",
    shadowColor: "hover:shadow-[0_35px_70px_-5px_rgba(37,99,235,0.7)]",
    satisfaction: 90,
    effectiveness: 87,
    accuracy: 93,
    path: "/agents/post-market-surveillance"
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
          <h2 className="text-4xl lg:text-5xl font-400 text-[#0b0080] mb-6">
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
              className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-8 transition-all duration-500 ${agent.shadowColor}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + idx * 0.12, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {/* Icon and Title */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className={`${agent.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  <agent.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-500 text-[#0b0080] mb-2">{agent.name}</h3>
                <p className="text-[#0b0080] text-sm">{agent.description}</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {agent.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Performance Metrics */}
              <div className="space-y-4 mb-6">
                {/* User Satisfaction */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">User Satisfaction</span>
                    <span className="text-sm font-bold text-slate-900">{agent.satisfaction}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${agent.satisfaction}%` }}
                    ></div>
                  </div>
                </div>

                {/* Effectiveness */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Effectiveness</span>
                    <span className="text-sm font-bold text-slate-900">{agent.effectiveness}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${agent.effectiveness}%` }}
                    ></div>
                  </div>
                </div>

                {/* Accuracy */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Accuracy</span>
                    <span className="text-sm font-bold text-slate-900">{agent.accuracy}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${agent.accuracy}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Button */}
              <Link to={agent.path || "/login"}>
                <button 
                  className={`w-full text-white font-medium ${agent.buttonColor} hover:opacity-90 hover:brightness-90 transition-all duration-300 px-4 py-3 rounded-lg`}
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
            <button className="bg-purple-500 hover:bg-[#7a31bd] text-white px-8 py-3 text-lg rounded-lg font-semibold transition-all duration-300">
              Explore All AI Agents
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
