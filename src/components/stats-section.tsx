import AnimatedCounter from "./AnimatedCounter";

export default function StatsSection() {
  return (
    <div className="w-full py-28">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-4xl md:text-5xl font-500 p-5 text-center text-[#0b0080] mb-0">
          No regulatory hype here. <span className="block md:inline text-orange-500">Just results!</span>
        </p>
        <p className="text-xl text-center text-gray-800 mb-12 max-w-3xl mx-auto">
          CHAAP is where innovators put AI to work for regulatory compliance. Connect AI directly to your workflows, build custom agents, and actually deliver on your compliance strategy.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div>
            <div className="text-5xl md:text-6xl font-extrabold text-blue-700 mb-2">
              <AnimatedCounter end={2500} suffix="+" />
            </div>
            <div className="text-lg text-black font-medium leading-tight">
              Regulatory<br />submissions<br />automated
            </div>
          </div>
          <div>
            <div className="text-5xl md:text-6xl font-extrabold text-purple-600 mb-2">
              <AnimatedCounter end={75} suffix="%" />
            </div>
            <div className="text-lg text-black font-medium leading-tight">
              Average time<br />reduction in<br />submissions
            </div>
          </div>
          <div>
            <div className="text-5xl md:text-6xl font-extrabold text-orange-500 mb-2">
              <AnimatedCounter end={98} suffix="%" />
            </div>
            <div className="text-lg text-black font-medium leading-tight">
              First-time<br />approval rate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
