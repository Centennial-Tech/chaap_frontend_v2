import React, { useEffect, useRef, useState } from "react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [request, setRequest] = useState<string>("");
  const convRef: any = useRef(null);

  interface response {
    content: string;
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
    {
      who: "User",
      what: "hwvhisf",
    },
    {
      who: "AI",
      what: "Sorry, I couldn't find any information in the documentation about that. Expect answer to be less accurateI could not find the answer to this in the verified sources.",
    },
  ]);

  const AI = ({ content }: response) => {
    return (
      <div className="flex gap-3 my-4 text-gray-600 text-sm">
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
          <span className="block font-bold text-gray-700">Chop </span>
          {content}
        </p>
      </div>
    );
  };

  useEffect(() => {
    if (convRef.current) {
      convRef.current.scrollTop = convRef.current.scrollHeight;
    }
  }, [request]);

  const User = ({ content }: response) => {
    return (
      <div className="flex gap-3 my-4 text-gray-600 text-sm">
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

  const handleSubmit = (e: any) => {
    e?.preventDefault();
    const newMessage = {
      who: type.user,
      what: request,
    };

    setConversations((prev: any) => [...prev, newMessage]);
    setRequest("");
  };

  return (
    <div className="z-50 fixed bottom-0 right-0">
      <div
        style={{
          boxShadow: "0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)",
        }}
        className={`w-full h-full max-w-[70%] md:max-w-[30%] max-h-[70%] transition-all duration-1000 ${
          isOpen ? "p-6 border" : "max-h-[0%] max-w-[0%]"
        } flex flex-col fixed bottom-[calc(4rem+1.5rem)] overflow-hidden right-0 mr-4 bg-white rounded-lg border-[#e5e7eb]`}
      >
        {
          <div
            className={`flex justify-between items-start  ${
              isOpen ? "" : "hidden"
            }`}
          >
            <div className={`flex flex-col space-y-1.5 pb-6`}>
              <h2 className="font-semibold text-lg tracking-tight text-[#034da2]">
                Ask Chopper
              </h2>
              <p className="text-sm text-[#6b7280] leading-3">
                Ask me anything!
              </p>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              type="button"
              className="inline-flex items-center cursor-pointer p-2 text-sm text-gray-500 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar-default"
              aria-expanded="false"
              data-collapse-toggle="navbar-default"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke="red"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>
          </div>
        }

        <div
          ref={convRef}
          className={`flex-grow items-start relative ${
            isOpen ? "" : "hidden"
          } pr-4 overflow-y-scroll flex flex-col`}
          style={{ minWidth: "100%" }}
        >
          {conversations.map(({ who, what }) => (
            <Conversation who={who} what={what} />
          ))}
        </div>
        <div className="flex items-center pt-0">
          <form
            className="flex items-center justify-center w-full space-x-2"
            onSubmit={handleSubmit}
          >
            <input
              autoFocus
              className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
              placeholder="Type your message"
              value={request}
              onChange={(e) => setRequest(e.target.value)}
            />
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-[#034da2] hover:bg-[#111827E6] h-10 px-4 py-2">
              Send
            </button>
          </form>
        </div>
      </div>
      <button
        className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
        type="button"
        aria-haspopup="dialog"
        aria-expanded="false"
        data-state="closed"
        onClick={() => setIsOpen((prev) => !prev)}
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
      </button>
    </div>
  );
};

export default ChatBot;
