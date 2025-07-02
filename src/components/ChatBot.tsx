import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Config } from "../constants";
import ChatLoader from "./ChatLoader";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [request, setRequest] = useState<string>("");
  const lastRef: any = useRef(null);
  const convRef: any = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);

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
  const [conversations, setConversations] = useState<IConversation[]>([
    {
      who: "AI",
      what: "Hi, how can I help you today?",
    },
  ]);

  const AI = ({ content, loading = false, ref = () => {} }: response) => {
    return (
      <div ref={ref} className="flex gap-3 my-4 text-gray-700 text-sm">
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

        <p className="leading-relaxed">
          <span className="block font-bold text-gray-700">Emily </span>
          {loading ? <ChatLoader /> : content}
        </p>
      </div>
    );
  };

  useEffect(() => {
    if (lastRef.current) {
      lastRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations]);

  useEffect(() => {
    if (convRef.current) {
      convRef.current.scrollTop = convRef.current.scrollHeight;
    }
  }, [request]);

  const User = ({ content }: response) => {
    return (
      <div className="flex gap-3 my-4 text-gray-700 text-sm">
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
        <p className="leading-relaxed">
          <span className="block font-bold text-gray-700">You </span>
          {content}
        </p>
      </div>
    );
  };

  const Conversation = ({ who, what }: IConversation) => {
    if (who === "AI") return <AI content={what} />;
    else return <User content={what} />;
  };

  const askBot = async (message: string) => {
    setLoading(true);
    const res = await axios.post(`${Config.API}/agent/live`, {
      request: message,
    });
    const newMessage = {
      who: type.ai,
      what: res.data.message,
    };
    setLoading(false);
    setConversations((prev: any) => [...prev, newMessage]);
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

  return (
    <div className="z-50 fixed bottom-0 right-0 font-mono">
      <div
        className={`${
          isOpen ? "max-h-[70%]" : "max-h-0"
        } transition-all duration-500 rounded-3xl text-white w-full max-w-[80%] md:max-w-[40%] lg:max-w-[30%] 2xl:max-w-[25%] shadow-2xl h-full flex flex-col fixed bottom-[calc(4rem+1.5rem)] overflow-hidden right-0 mr-4 bg-white border-[#e5e7eb]`}
      >
        <div className="flex gap-2 p-3 font-mono text-lg font-bold bg-[#034da2] items-center shadow-xl">
          <div
            className="w-10 h-10 rounded-full"
            style={{
              background: "linear-gradient(to right, #ffffff, #ed6c02)",
            }}
          ></div>
          <span>Emily</span>
        </div>

        <div
          ref={convRef}
          className={`flex-grow h-[90%] items-start relative ${
            isOpen ? "" : "hidden"
          } p-4 overflow-y-auto flex flex-col`}
          style={{ minWidth: "100%" }}
        >
          {conversations.map(({ who, what }) => (
            <Conversation who={who} what={what} />
          ))}
          {loading ? <AI ref={lastRef} content="" loading /> : ""}
        </div>

        <div className="flex items-center pt-0 p-4">
          <form
            className="flex items-center justify-center w-full space-x-2"
            onSubmit={handleSubmit}
          >
            <input
              autoFocus
              className="flex h-9 md:h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
              placeholder="Type your message"
              value={request}
              onChange={(e) => {
                if (!isOpen) setIsOpen(true);
                setRequest(e.target.value);
              }}
            />
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-[#034da2] hover:bg-[#111827E6] h-9 md:h-10 px-4 py-2">
              Ask
            </button>
          </form>
        </div>
      </div>
      <button
        className={`${
          isOpen ? "" : "animate-bounce"
        } hover:animate-none fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-12 h-12 md:w-16 md:h-16 bg-[#034da2] hover:opacity-90 m-0 cursor-pointer border-none bg-none p-0 normal-case leading-5 hover:text-gray-900`}
        type="button"
        aria-haspopup="dialog"
        aria-expanded="false"
        data-state="closed"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span
          className={`opacity-100 ${
            !isOpen ? "" : "!opacity-0"
          } transition-all duration-500 absolute`}
        >
          <svg
            xmlns=" http://www.w3.org/2000/svg"
            width="30"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="text-white block border-gray-200 align-middle"
          >
            <path
              d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"
              className="border-gray-200"
            ></path>
          </svg>
        </span>
        <span
          className={`opacity-100 ${
            isOpen ? "" : "!opacity-0"
          } transition-all duration-500 absolute`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke="white"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </span>
      </button>
    </div>
  );
};

export default ChatBot;
