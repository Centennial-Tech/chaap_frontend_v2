import { X, Check, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";

const beforeItems = [
  "Manual document management",
  "Lengthy submission cycles", 
  "Static standard operating procedures",
  "Siloed strategic planning",
  "Costly consulting fees"
];

const afterItems = [
  "AI-assisted content generation",
  "Shorter time to market",
  "Adaptive compliance agents", 
  "Coordinated execution",
  "Efficient, scalable growth"
];

export default function ComparisonSection() {
  return (
    <section id="comparison" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Transform Your <span className="text-orange-500">Regulatory Process</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            See how CHAAP revolutionizes traditional regulatory workflows with intelligent automation and AI-powered insights.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Stacked cards */}
          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {/* Before CHAAP */}
            <div className="bg-red-50 border border-red-200 p-8 rounded-2xl shadow-sm text-red-700" style={{ minHeight: '260px' }}>
              <h3 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
                <X className="mr-3 text-red-600" size={24} />
                Before CHAAP
              </h3>
              <motion.ul className="space-y-4" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{}}>
                {beforeItems.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.12, ease: "easeOut" }}
                    viewport={{ once: true }}
                  >
                    <Minus className="text-red-500 mt-1 mr-3 flex-shrink-0" size={18} />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
            {/* With CHAAP */}
            <div className="bg-green-50 border border-green-200 p-8 rounded-2xl shadow-sm text-green-700" style={{ minHeight: '260px' }}>
              <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <Check className="mr-3 text-green-600" size={24} />
                With CHAAP
              </h3>
              <motion.ul className="space-y-4" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{}}>
                {afterItems.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.12, ease: "easeOut" }}
                    viewport={{ once: true }}
                  >
                    <Plus className="text-green-500 mt-1 mr-3 flex-shrink-0" size={18} />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
          {/* Right: Large white card with floating stats */}
          <motion.div
            className="relative w-full h-[420px] md:h-[540px] flex items-center justify-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="w-full h-full bg-white rounded-2xl shadow-2xl border border-slate-100" />
            {/* Floating stat top right */}
            <div className="absolute top-6 right-6 bg-white px-6 py-4 rounded-xl shadow-lg border border-slate-200 text-right transition-transform duration-200 hover:scale-105 hover:-translate-y-1 cursor-pointer">
              <div className="text-orange-500 text-2xl font-bold">75%</div>
              <div className="text-gray-500 text-sm">Faster Submissions</div>
            </div>
            {/* Floating stat bottom left */}
            <div className="absolute bottom-6 left-6 bg-white px-6 py-4 rounded-xl shadow-lg border border-slate-200 text-left transition-transform duration-200 hover:scale-105 hover:-translate-y-1 cursor-pointer">
              <div className="text-blue-600 text-2xl font-bold">90%</div>
              <div className="text-gray-500 text-sm">Accuracy Rate</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
