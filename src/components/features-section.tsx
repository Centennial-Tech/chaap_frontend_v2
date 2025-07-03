import { Bot, Target, Boxes, TrendingUp, RotateCcw, Shield } from "lucide-react";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Centennial Healthcare{" "}
            <span className="text-orange-500">AgenticAI Platform</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Whether you are preparing for premarket pathways, developing technical documentation, or maintaining post-market oversight, CHAAP empowers your team to navigate compliance with clarity, speed, and confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-8 rounded-2xl shadow-lg border transition-all duration-300 group hover:shadow-xl hover:border-purple-300/50 bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200 hover:from-purple-100 hover:to-purple-150"
            >
              <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <feature.icon className="text-white drop-shadow-sm" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 transition-colors duration-300 text-slate-800 group-hover:text-purple-700">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-slate-700">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
