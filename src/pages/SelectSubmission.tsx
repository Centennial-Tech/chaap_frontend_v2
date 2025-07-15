import AnimatedBackground from "../components/AnimatedBackground";

export default function SelectSubmission() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Content */}
      <div className="text-center px-4 relative z-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Select a Submission
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl">
          Please select a submission from the dropdown menu in header above to continue
        </p>
        
        {/* TODO:Arrow pointing to dropdown */}
        {/* <div className="fixed top-4 right-[200px]"> 
          <div className="relative">
            <ArrowUpRight 
              className="w-12 h-12 text-blue-500 transform rotate-[15deg]" 
              strokeWidth={2.5}
            />
            <div className="absolute top-0 left-0 w-full h-full">
              <ArrowUpRight 
                className="w-12 h-12 text-blue-500/30 transform rotate-[15deg] animate-pulse" 
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
} 