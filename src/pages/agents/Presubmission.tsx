const Presubmission = () => {
  const rightArrow = new URL("../../assets/arrow-right.svg", import.meta.url)
    .href;

  const regulatoryChallenges: string[] = [
    "Uncertainty around selecting the right regulatory path",
    "Difficulty interpreting evolving FDA guidance for AI/ML or novel technologies",
    "Limited access to relevant historical decisions and predicate comparisons",
    "Gaps in internal regulatory expertise at the earlier stages",
  ];

  const ChallengeItem = ({ text }: any) => {
    return (
      <div
        className="bg-gradient-to-r from-[#034ea22e] via-[#904ec821] to-[#f370211f]
    list-none
    // rounded-none
    relative
    py-[30px] pr-[15px] pl-[80px]
    text-lg md:text-2xl
    font-light flex items-center gap-7 hover:shadow-md"
      >
        <img src={rightArrow} alt="->" className="w-[30px] h-[30px]" />
        <span>{text}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      {/* 1st screen */}
      <div className="h-screen flex flex-col gap-12 pt-[30px] md:pt-[48px] w-full max-w-[1260px] px-[20px] mx-auto">
        {/* Basic */}
        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col">
            <span className="title text-2xl md:text-4xl font-medium">
              Pre-Submission Strategy Agent
            </span>
            <span className="text-lg font-medium">
              Navigating Regulatory Pathways with Confidence
            </span>
          </div>
          <p>
            The Pre-Submission Strategy agent is CHAAP’s AI-powered advisor for
            selecting the right regulatory path, early and accurately. For
            health innovators, biotech startups, drug and device developers,
            this agent provides data-backed guidance that eliminates guesswork
            and streamlines engagement with regulatory authorities. Built to
            decode complex FDA pathways, simulate Q-submission interactions, and
            surface regulatory precedents, the agent helps teams avoid missteps,
            reduce rework, and prepare smarter.
          </p>
        </div>
        {/* Challenges */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <p className="text-lg md:text-4xl font-medium">
              The Regulatory Challenge
            </p>
            <p className="text-[15px] md:text-[24px] font-bold">
              Healthcare innovators often face:
            </p>
          </div>
          {/* challenge items */}
          <ul className="flex flex-col gap-[2px]">
            {regulatoryChallenges.map((item) => (
              <ChallengeItem text={item} />
            ))}
          </ul>
        </div>
      </div>
      {/* 2nd screen */}
      <div className="h-screen bg-white">
        <div className="pt-[30px] md:pt-[48px] w-full max-w-[1260px] px-[20px] mx-auto">
          wdhschywdsv
        </div>
      </div>
    </div>
  );
};

export default Presubmission;
