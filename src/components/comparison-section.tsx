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
          <h2 className="text-4xl lg:text-5xl font-400 text-[#0b0080] mb-6">
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
            className="relative w-full h-[420px] md:h-[540px]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {/* Floating stat top right - positioned outside and overlapping */}
            <div className="absolute -top-4 -right-4 bg-white px-6 py-4 rounded-xl shadow-lg border border-slate-200 text-right transition-transform duration-200 hover:scale-105 hover:-translate-y-1 cursor-pointer z-10">
              <div className="text-orange-500 text-2xl font-bold">75%</div>
              <div className="text-gray-500 text-sm">Faster Submissions</div>
            </div>

            <div className="w-full h-full bg-white rounded-2xl shadow-2xl border border-slate-100 flex items-center justify-center p-8">
              <svg
                viewBox="0 0 440 360"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" x2="0" y1="1" y2="0">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ff7f50" />
                  </linearGradient>
                </defs>

                {/* Background Grid */}
                <g className="grid-lines" stroke="#e5e7eb" strokeWidth="1">
                  {[...Array(6)].map((_, i) => (
                    <line
                      key={`horizontal-${i}`}
                      x1="80"
                      y1={50 + (i * 45)}
                      x2="360"
                      y2={50 + (i * 45)}
                      strokeDasharray="4,4"
                      opacity="0.3"
                    />
                  ))}
                </g>

                {/* Axes */}
                <line x1="80" y1="270" x2="360" y2="270" stroke="#475569" strokeWidth="2" />
                <line x1="80" y1="20" x2="80" y2="270" stroke="#475569" strokeWidth="2" />

                {/* Bars */}
                {[
                  { label: "Traditional\nProcess", value: 72, x: 140, fill: "#64748b" },
                  { label: "Manual\nReview", value: 78, x: 200, fill: "#64748b" },
                  { label: "Semi-\nAutomated", value: 85, x: 260, fill: "#64748b" },
                  { label: "CHAAP\nAI", value: 92, x: 320, fill: "url(#barGradient)" }
                ].map((bar, i) => (
                  <g key={i}>
                    <rect
                      x={bar.x - 25}
                      y={270 - ((bar.value - 70) * 10)}
                      width="50"
                      height={(bar.value - 70) * 10}
                      fill={bar.fill}
                      className="transition-all duration-300 hover:opacity-90"
                    >
                      <animate
                        attributeName="height"
                        from="0"
                        to={(bar.value - 70) * 10}
                        dur="1s"
                        begin={`${i * 0.2}s`}
                        fill="freeze"
                      />
                    </rect>
                    {/* Value on top of bar */}
                    <text
                      x={bar.x}
                      y={255 - ((bar.value - 70) * 10)}
                      textAnchor="middle"
                      className="fill-slate-700 font-medium"
                      fontSize="14"
                    >
                      {bar.value}%
                    </text>
                    {/* Multi-line x-axis labels */}
                    {bar.label.split('\n').map((line, lineIndex) => (
                      <text
                        key={lineIndex}
                        x={bar.x}
                        y={290 + (lineIndex * 18)}
                        textAnchor="middle"
                        className="fill-slate-600 text-xs font-medium"
                      >
                        {line}
                      </text>
                    ))}
                  </g>
                ))}

                {/* Y-axis labels */}
                {[70, 75, 80, 85, 90, 95].map((value, i) => (
                  <g key={`y-${i}`}>
                    <text
                      x="65"
                      y={270 - ((value - 70) * 10)}
                      textAnchor="end"
                      className="fill-slate-500 text-xs font-medium"
                    >
                      {value}%
                    </text>
                    <line
                      x1="75"
                      y1={270 - ((value - 70) * 10)}
                      x2="80"
                      y2={270 - ((value - 70) * 10)}
                      stroke="#475569"
                      strokeWidth="2"
                    />
                  </g>
                ))}

                {/* Axis Labels */}
                <text x="220" y="345" textAnchor="middle" className="text-sm fill-slate-600 font-medium">
                  Submission Process Type
                </text>
                <text x="30" y="160" textAnchor="middle" transform="rotate(-90, 30, 160)" className="text-sm fill-slate-600 font-medium">
                  Accuracy Rate (%)
                </text>
              </svg>
            </div>

            {/* Floating stat bottom left - positioned outside and overlapping */}
            <div className="absolute -bottom-4 -left-4 bg-white px-6 py-4 rounded-xl shadow-lg border border-slate-200 text-left transition-transform duration-200 hover:scale-105 hover:-translate-y-1 cursor-pointer z-10">
              <div className="text-[#0b0080] text-2xl font-bold">90%</div>
              <div className="text-gray-500 text-sm">Accuracy Rate</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
