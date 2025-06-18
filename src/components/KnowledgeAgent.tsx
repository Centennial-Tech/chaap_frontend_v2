import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Config } from "../constants";
import ChatLoader from "./ChatLoader";
import Particles from "react-tsparticles";
import { ATTACT_LINES } from "../constants/animation_config";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import {
  ContentCopyOutlined,
  StopRounded,
  ThumbDown,
  ThumbDownAltOutlined,
  ThumbUp,
  ThumbUpAltOutlined,
  VolumeUpOutlined,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import useCustomSpeech from "../hooks/useCustomSpeech";
import ReactMarkdown from "react-markdown";

interface response {
  content: string;
  loading?: boolean;
  ref?: any;
}

interface IConversation {
  who: string;
  what: string;
}

const type = {
  ai: "AI",
  user: "User",
};

const AI = ({ content, loading = false, ref = () => {} }: response) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [unliked, setUnliked] = useState<boolean>(false);
  const { start, stop, speechStatus } = useCustomSpeech({ content });

  return (
    <div
      ref={ref}
      onClick={() => navigator.clipboard.writeText(content)}
      className="flex gap-3 my-4 text-gray-600 text-sm"
    >
      <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
        <div className="rounded-full bg-gray-100 border p-1">
          <svg
            stroke="none"
            fill="black"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
            height="20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
            ></path>
          </svg>
        </div>
      </span>

      <div className="leading-relaxed flex flex-col gap-2">
        {/* import ContentCopyIcon from '@mui/icons-material/ContentCopy'; */}
        <div className="flex justify-between">
          <span className="block font-bold text-gray-700">Agent-K </span>
          <div
            className={`mr-5 flex items-center gap-3 ${
              loading ? "hidden" : ""
            }`}
          >
            <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
              <ContentCopyOutlined
                onClick={async () => {
                  await navigator.clipboard.writeText(content);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 5000);
                }}
                sx={{ color: "black" }}
                className="cursor-pointer !w-3 opacity-80 hover:opacity-100"
              />
            </Tooltip>

            <Tooltip title={speechStatus === "started" ? "Stop" : "Read loud"}>
              {speechStatus === "started" ? (
                <StopRounded
                  className="cursor-pointer !w-4"
                  sx={{ color: "red" }}
                  onClick={stop}
                />
              ) : (
                <VolumeUpOutlined
                  onClick={start}
                  sx={{ color: "black" }}
                  className="cursor-pointer !w-4 opacity-80 hover:opacity-100"
                />
              )}
            </Tooltip>

            <Tooltip
              title="Good response"
              className={
                !unliked ? "opacity-100" : "opacity-0 pointer-events-none"
              }
            >
              {liked ? (
                <ThumbUp
                  sx={{ color: "#216C17" }}
                  className="cursor-pointer !w-3"
                />
              ) : (
                <ThumbUpAltOutlined
                  onClick={() => setLiked(true)}
                  sx={{ color: "#216C17" }}
                  className="cursor-pointer !w-3 opacity-80 hover:opacity-100"
                />
              )}
            </Tooltip>

            <Tooltip
              title="Bad response"
              className={
                !liked ? "opacity-100" : "opacity-0 pointer-events-none"
              }
            >
              {unliked ? (
                <ThumbDown
                  sx={{ color: "red" }}
                  className="cursor-pointer !w-3"
                />
              ) : (
                <ThumbDownAltOutlined
                  onClick={() => setUnliked(true)}
                  sx={{ color: "red" }}
                  className="cursor-pointer !w-3 opacity-80 hover:opacity-100"
                />
              )}
            </Tooltip>
          </div>
        </div>
        {loading ? <ChatLoader /> : <ReactMarkdown>{content}</ReactMarkdown>}
      </div>
    </div>
  );
};

const KnowledgeAgent = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [request, setRequest] = useState<string>("");
  const lastRef: any = useRef(null);
  const convRef: any = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [conversations, setConversations] = useState<IConversation[]>([
    {
      who: "AI",
      what: "Hi, how can I help you today?",
    },
  ]);

  useEffect(() => {
    // if (lastRef.current) {
    //   lastRef.current.scrollIntoView({ behavior: "smooth" });
    // }
  }, [conversations]);

  useEffect(() => {
    if (convRef.current) {
      convRef.current.scrollTop = convRef.current.scrollHeight;
    }
  }, [request]);

  const User = ({ content }: response) => {
    return (
      <div className="flex gap-3 my-4 text-gray-600 text-sm self-end max-w-[50%]">
        <p className="leading-relaxed">
          <span className="block font-bold text-gray-700">You </span>
          {content}
        </p>
        <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
          <div className="rounded-full bg-gray-100 border p-1">
            <svg
              stroke="none"
              fill="black"
              stroke-width="0"
              viewBox="0 0 16 16"
              height="20"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"></path>
            </svg>
          </div>
        </span>
      </div>
    );
  };

  const Conversation = ({ who, what }: IConversation) => {
    if (who === "AI") return <AI content={what} />;
    else return <User content={what} />;
  };

  const askBot = async (message: string) => {
    try {
      setLoading(true);
      const res = await axios.post(`${Config.API}/agent/regulatory`, {
        request: message,
      });
      const newMessage = {
        who: type.ai,
        what: res.data.message,
      };
      setLoading(false);
      setConversations((prev: any) => [...prev, newMessage]);
    } catch (error) {
      const newMessage = {
        who: type.ai,
        what: "Token limit reached. Please try again in a few seconds.",
      };
      setLoading(false);
      setConversations((prev: any) => [...prev, newMessage]);
    }
  };

  const handleSubmit = (e: any) => {
    e?.preventDefault();
    const newMessage = {
      who: type.user,
      what: request,
    };

    setConversations((prev: any) => [...prev, newMessage]);
    askBot(request);
    setRequest("");
  };

  const particlesInit = useCallback((engine: Engine) => {
    loadFull(engine);
  }, []);
  return (
    <div className="mt-[60px] flex justify-center items-center text-lg w-full h-[calc(100vh-60px)]">
      <Particles
        init={particlesInit as any}
        options={ATTACT_LINES as any}
        className="absolute inset-0 opacity-70"
        style={{
          zIndex: -1,
        }}
      />
      <div className="relative w-full h-[80%] font-mono md:max-w-[80%] lg:max-w-[60%] m-5">
        <div
          style={{
            backdropFilter: "blur(10px)",
          }}
          className={`max-h-[90%s] transition-all duration-500 rounded-3xl border-[#034da2] border text-white w-full h-full flex flex-col bottom-[calc(4rem+1.5rem)] overflow-hidden right-0 mr-4 shadow-md`}
        >
          <div className="flex gap-2 p-3 font-mono text-lg font-bold bg-[#034da2] px-5 items-center justify-between shadow-xl">
            <div className="flex gap-5 items-center">
              <div
                className="w-10 h-10 rounded-full"
                style={{
                  background: "linear-gradient(to right, #ffffff, #034da2)",
                }}
              ></div>
              <span>Agent-K</span>
            </div>
            <Tooltip title="This is a Knowledge Agent.">
              <InfoOutlineIcon />
            </Tooltip>
          </div>

          <div
            ref={convRef}
            className={`flex-grow items-start relative p-4 overflow-y-auto flex flex-col`}
            style={{ minWidth: "100%" }}
          >
            {conversations.map(({ who, what }) => (
              <Conversation who={who} what={what} />
            ))}
            {loading ? <AI ref={lastRef} content="" loading /> : ""}
          </div>

          <div className="flex items-center pt-0 mb-5 p-4 md:max-w-[70%] lg:max-w-[50%] w-full mx-auto">
            <form
              className="flex items-center justify-center w-full space-x-2"
              onSubmit={handleSubmit}
            >
              <input
                autoFocus
                className="flex h-9 md:h-10 w-full rounded-md border bg-blue-200 border-blue-200 outline-none shadow-lg px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                placeholder="Type your message"
                value={request}
                onChange={(e) => {
                  if (!isOpen) setIsOpen(true);
                  setRequest(e.target.value);
                }}
              />
              <button className="inline-flex items-center justify-center rounded-md shadow-lg text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-[#034da2] hover:bg-[#111827E6] h-9 md:h-10 px-4 py-2">
                Ask
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeAgent;
