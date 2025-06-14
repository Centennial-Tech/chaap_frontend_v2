import React, { useEffect, useRef } from "react";
import { ATTACT_LINES } from "../constants/animation_config";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";
import { Link } from "react-router-dom";
import BgCustomGrid from "../components/BgCustomGrid";
import ChatBot from "../components/ChatBot";

interface IFeature {
  icon: string;
  title: string;
  description: string;
}

interface IAgent {
  name: string;
  desc: string;
  link: string;
}

interface IWhyChaap {
  yes: string;
  no: string;
}

const Home = () => {
  const particlesInit = (engine: Engine) => {
    loadFull(engine);
  };

  const features: IFeature[] = [
    {
      icon: "https://chaap.ai/assets/icons15-7959893a.png",
      title: "Smart Automation",
      description:
        "Each AI agent acts as a specialized assistant planning, generating, validating, and adapting submission materials to meet evolving regulatory expectations.",
    },
    {
      icon: "https://chaap.ai/assets/icons11-d25a259d.png",
      title: "Precision & Compliance",
      description:
        "Agents are trained on real-world guidance documents and historical precedents, delivering outputs that are accurate, well-structured, and submission ready.",
    },
    {
      icon: "https://chaap.ai/assets/icons19-5716fb44.png",
      title: "Modular Flexibility",
      description:
        "Whether you need support for a single submission element or end-to-end compliance, CHAAP adapts to your team’s structure and needs with composable agents.",
    },
    {
      icon: "https://chaap.ai/assets/icons122-a8165614.png",
      title: "Scalable Support",
      description:
        "From startups to enterprise teams and consulting partners, CHAAP offers scalable, AI-driven insights that grow with your product portfolio and regulatory demands.",
    },
    {
      icon: "https://chaap.ai/assets/icons12-3da78123.png",
      title: "Always Up-to-Date",
      description:
        "Our agents evolve continuously alongside updated guidance and rule changes, ensuring your workflows and deliverables remain aligned without manual effort.",
    },
  ];

  const agents: IAgent[] = [
    {
      name: "Pre-submission Strategy Agent",
      desc: "Substantial reduction in consultation-related expenses",
      link: "/agents/presubmission",
    },
    {
      name: "Regulatory Document Preparation Agent",
      desc: "Fewer iterations with accelerated submission process",
      link: "",
    },
    {
      name: "FDA Meeting Prep Agent",
      desc: "Thoroughly prepared and confident ahead of FDA engagements",
      link: "",
    },
    {
      name: "Regulatory Knowledge Agent",
      desc: "High reviewer satisfaction with well-structured submissions",
      link: "",
    },
    {
      name: "Post Market Surveillance Agent",
      desc: "Significantly reduced resubmission risk",
      link: "",
    },
    {
      name: "Regulatory AI Assistant​",
      desc: "Embedded directly into the CHAAP platform",
      link: "",
    },
  ];

  const whyChaap: IWhyChaap[] = [
    {
      yes: "AI-assisted content generation",
      no: "Manual document management",
    },
    {
      yes: "Shorter time to market",
      no: "Lengthy submission cycles",
    },
    {
      yes: "Adaptive compliance agents",
      no: "Static standard operating procedures",
    },
    {
      yes: "Coordinated execution",
      no: "Siloed strategic planning",
    },
    {
      yes: "Efficient, scalable growth",
      no: "Costly consulting fees",
    },
  ];

  interface IBgCustomSize {
    sm: string;
    md: string;
    lg: string;
  }

  interface IBgCustom {
    size?: keyof IBgCustomSize;
  }

  const BgCustomCard = ({ size = "sm" }: IBgCustom) => {
    const top = Math.floor(Math.random() * 80); // up to 80% vertically
    const left = Math.floor(Math.random() * 80);
    const BG_CUSTOM_SIZE: IBgCustomSize = {
      sm: "50",
      md: "150",
      lg: "250",
    };
    return (
      <div
        className="flex gap-1 absolute z-[-1]"
        style={{
          top: `${top}%`,
          left: `${left}%`,
          width: `${BG_CUSTOM_SIZE[size]}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className="w-full animate-pulse shadow-2xl bg-[#f37021] top-[-10%] left-[50%]  [clip-path:polygon(100%_0,0_0,0_100%,100%_75%)] rounded-xl p-4 sm:p-6 overflow-hidden bg-neutral-15 text-pureWhite transition-all duration-300 rounded-bl-lg"
          style={{
            zIndex: -1,
            aspectRatio: 1 /* Helps with responsiveness */,
            // clipPath: "polygon(0% 24%, 0% 100%, 100% -30%)",
          }}
        ></div>
        <div className="animate-pulse">
          <div
            className="w-full rotate-180 shadow-2xl bg-[#034da2] [clip-path:polygon(100%_0,0_0,0_100%,100%_75%)] rounded-xl p-4 sm:p-6 overflow-hidden bg-neutral-15 text-pureWhite transition-all duration-300 rounded-bl-lg"
            style={{
              zIndex: -1,
              aspectRatio: 1 /* Helps with responsiveness */,
              // clipPath: "polygon(0% 24%, 0% 100%, 100% -30%)",
            }}
          ></div>
        </div>
      </div>
    );
  };

  const FeatureCard = ({ title, icon, description }: IFeature) => {
    return (
      <div className="flex flex-col flex-grow gap-4 max-w-[302px] w-full overflow-hidden">
        <img className="w-12 md:w-14" src={icon} alt="icon" />
        <p className="text-xl md:text-2xl">{title}</p>{" "}
        <p className="text-sm md:text-[16px]">{description}</p>
      </div>
    );
  };

  const Agent = ({ name, desc, link }: IAgent) => {
    return (
      <div className="flex-grow max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 glass">
        <div className="p-5 flex flex-col justify-between h-full">
          <Link to={link}>
            <h5 className="mb-2 text-2xl font-bold tracking-tight hover:opacity-70 text-black">
              {name}
            </h5>
          </Link>
          <p className="mb-3 font-normal dark:text-gray-400 text-black">
            {desc}
          </p>
          <Link
            to={link}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-orange-500 rounded-lg hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Read more
            <svg
              className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>
        </div>
      </div>
    );
  };

  const WhyChaapItem = ({ yes, no }: IWhyChaap) => {
    return (
      <div className="grid grid-cols-2 px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700">
        <div className="flex gap-2 items-center justify-center">
          <svg
            className="w-3 h-3 text-red-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          {no}
        </div>
        <div className="flex gap-2 items-center justify-center">
          <svg
            className="w-3 h-3 text-green-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 12"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5.917 5.724 10.5 15 1.5"
            />
          </svg>
          {yes}
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full h-full flex-col">
      <ChatBot />
      <div className="w-full h-screen overflow-hidden">
        <div className="w-full h-full relative flex justify-center items-center md:items-start">
          <Particles
            init={particlesInit as any}
            options={ATTACT_LINES as any}
            className="absolute inset-0"
            style={{
              zIndex: -1,
            }}
          />
          <div className="flex flex-col p-10 justify-center items-center gap-5 relative md:top-1/4">
            <div className="">
              <p className="text-5xl">
                <span className="text-orange-400 font-bold">AI</span> That
                Understands Regulation
              </p>
              <p className="text-4xl">So You Don't Have To.</p>
            </div>

            <Link
              to="/contact"
              type="submit"
              className="text-white max-w-[136px] bg-[#f37021] hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Book A Demo!
            </Link>
          </div>
        </div>
      </div>
      {/* Section 2 */}
      <div className="w-full overflow-hidden">
        <div className="flex flex-col w-full max-w-7xl px-3 mx-auto py-6 md:py-20 gap-16">
          {/* Head */}
          <div className="flex flex-col gap-2">
            <p className="text-2xl md:text-4xl font-semibold">
              <span className="text-[#f37021]">Centennial</span>{" "}
              <span className="text-[#034da2]">Healthcare</span> AgenticAI
              Platform
            </p>
            <p className="text-sm md:text-[16px]">
              Whether you are preparing for premarket pathways, developing
              technical documentation, or maintaining post-market oversight,
              Centennial Healthcare AgenticAI Platform (CHAAP) empowers your
              team to navigate compliance with clarity, speed, and confidence.
              It is a modular, AI-powered platform built to simplify and
              accelerate regulatory submission processes across healthcare,
              biotech, diagnostics, and digital therapeutics. By combining
              domain-trained agents with real-time regulatory intelligence and
              automation, CHAAP turns traditional bottlenecks into streamlined
              workflows, transforming regulatory complexity into a strategic
              advantage.
            </p>
          </div>

          {/* Cards */}
          <div className="flex flex-col items-center md:items-start md:flex-row flex-wrap gap-4">
            {features.map(({ title, icon, description }) => (
              <FeatureCard
                key={title}
                title={title}
                icon={icon}
                description={description}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Section 3 - Agents */}
      <div
        id="agents"
        className="w-full scroll-m-[60px] text-black bg-white relative border-t 2xl:h-[calc(100vh-59px)] bg-opacity-90 z-0"
      >
        <BgCustomGrid />
        <div className="flex flex-col w-full items-center justify-center max-w-7xl px-3 mx-auto py-6 md:py-10 gap-16">
          <div className="text-2xl md:text-4xl font-bold">
            Meet Our Smart Agents{" "}
          </div>
          <div className="flex flex-col justify-center md:flex-row flex-wrap gap-1 ">
            {agents.map(({ name, link, desc }) => (
              <Agent key={name} name={name} link={link} desc={desc} />
            ))}
          </div>
        </div>
      </div>
      <div className="relative my-16 z-0">
        <div className="max-w-2xl mx-auto flex items-center justify-center flex-col gap-16 p-5 h-full">
          <div className="text-2xl md:text-4xl font-semibold">Why CHAAP?</div>
          <div
            id="detailed-pricing"
            className="w-full overflow-x-auto shadow-lg"
          >
            <div className="overflow-hidden min-w-max">
              <div className="grid grid-cols-2 place-items-center p-4 text-sm text-white font-bold bg-orange-500 border-t border-b border-gray-200 gap-x-16 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                <div>Before</div>
                <div>With CHAAP</div>
              </div>
              {whyChaap.map(({ yes, no }) => (
                <WhyChaapItem key={yes} yes={yes} no={no} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
