import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Bot } from "lucide-react";
import { Config } from "../constants";
import ChatLoader from "./ChatLoader";
import { Button } from "./ui/Button";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [request, setRequest] = useState<string>("");
  const lastRef: any = useRef(null);
  const convRef: any = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [streaming, setStreaming] = useState<boolean>(true); // Toggle for streaming mode

  // Add state for typing effect
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [userScrolledUp, setUserScrolledUp] = useState<boolean>(false);

  interface response {
    content: string;
    loading?: boolean;
    ref?: any;
  }

  interface IConversation {
    who: string;
    what: string;
    isStreaming?: boolean;
    isTyping?: boolean;
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
          <div className="rounded-full bg-gray-100 border p-1 flex items-center justify-center">
            <Bot className="w-5 h-5 text-gray-700" />
          </div>
        </span>

        <p className="leading-relaxed">
          <span className="block font-bold text-gray-700">Emily </span>
          {loading ? (
            <ChatLoader />
          ) : (
            <>
              {content}
              {isTyping && <span className="animate-pulse">|</span>}
            </>
          )}
        </p>
      </div>
    );
  };

  // Typing effect function
  const startTypingEffect = (text: string, messageIndex: number) => {
    setIsTyping(true);
    let currentIndex = 0;

    const typeCharacter = () => {
      if (currentIndex < text.length) {
        const displayText = text.substring(0, currentIndex + 1);
        setConversations((prev) =>
          prev.map((conv, index) =>
            index === messageIndex
              ? { ...conv, what: displayText, isTyping: true }
              : conv
          )
        );
        currentIndex++;
      } else {
        // Typing complete
        setConversations((prev) =>
          prev.map((conv, index) =>
            index === messageIndex
              ? { ...conv, isTyping: false, isStreaming: false }
              : conv
          )
        );
        setIsTyping(false);
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
      }
    };

    typingIntervalRef.current = setInterval(typeCharacter, 5); // Faster typing speed (was 30ms)
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

  // Auto-scroll when typing, unless user scrolled up
  useEffect(() => {
    if (isTyping && !userScrolledUp && convRef.current) {
      convRef.current.scrollTop = convRef.current.scrollHeight;
    }
  }, [conversations, isTyping, userScrolledUp]);

  // Detect if user manually scrolled up
  const handleScroll = () => {
    if (convRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = convRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5; // 5px threshold
      setUserScrolledUp(!isAtBottom);
    }
  };

  // Reset scroll state when new conversation starts
  useEffect(() => {
    if (loading) {
      setUserScrolledUp(false);
    }
  }, [loading]);

  // Cleanup typing interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  const User = ({ content }: response) => {
    return (
      <div className="flex gap-3 my-4 text-gray-700 text-sm">
        <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
          <div className="rounded-full bg-gray-100 border p-1">
            <svg
              stroke="none"
              fill="black"
              strokeWidth="0"
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

  // Streaming function using Server-Sent Events with typing effect
  const askBotStreaming = async (message: string) => {
    setLoading(true);

    // Calculate the index where AI message will be added
    const aiMessageIndex = conversations.length + 1; // +1 because user message will be added first

    try {
      const response = await fetch(`${Config.API}/agent/live`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request: message,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.error) {
                  console.error("Streaming error:", data.error);
                  setLoading(false);
                  // Add error message
                  setConversations((prev) => [
                    ...prev,
                    {
                      who: type.ai,
                      what: "Sorry, an error occurred. Please try again.",
                      isStreaming: false,
                      isTyping: false,
                    },
                  ]);
                  return;
                }

                if (data.content) {
                  accumulatedContent += data.content;
                  // Don't update UI immediately, just accumulate content
                }

                if (data.done) {
                  // When streaming is complete, stop loading and add empty message
                  setLoading(false);
                  setConversations((prev) => [
                    ...prev,
                    {
                      who: type.ai,
                      what: "",
                      isStreaming: true,
                      isTyping: false,
                    },
                  ]);
                  // Start typing effect
                  startTypingEffect(accumulatedContent, aiMessageIndex);
                  return;
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setLoading(false);
      // Add error message
      setConversations((prev) => [
        ...prev,
        {
          who: type.ai,
          what: "Sorry, an error occurred. Please try again.",
          isStreaming: false,
          isTyping: false,
        },
      ]);
    }
  };

  // Non-streaming function with typing effect
  const askBot = async (message: string) => {
    setLoading(true);
    const aiMessageIndex = conversations.length + 1;

    try {
      const res = await axios.post(`${Config.API}/agent/live`, {
        request: message,
        stream: false,
      });

      setLoading(false);
      // Add empty AI message after loading completes
      setConversations((prev: any) => [
        ...prev,
        {
          who: type.ai,
          what: "",
          isStreaming: true,
          isTyping: false,
        },
      ]);

      // Start typing effect with the response
      startTypingEffect(res.data.message, aiMessageIndex);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      // Add error message
      setConversations((prev: any) => [
        ...prev,
        {
          who: type.ai,
          what: "Sorry, an error occurred. Please try again.",
          isTyping: false,
          isStreaming: false,
        },
      ]);
    }
  };

  const handleSubmit = (e: any) => {
    e?.preventDefault();

    // Don't submit if already typing or loading
    if (loading || isTyping) return;

    const newMessage = {
      who: type.user,
      what: request,
    };

    setConversations((prev: any) => [...prev, newMessage]);

    // Choose streaming or non-streaming based on state
    if (streaming) {
      askBotStreaming(request);
    } else {
      askBot(request);
    }

    setRequest("");
  };

  return (
    <div className="z-50 fixed bottom-0 right-0">
      <div
        className={`${
          isOpen ? "max-h-[70%]" : "max-h-0"
        } transition-all duration-500 rounded-3xl text-white w-full max-w-[80%] md:max-w-[40%] lg:max-w-[30%] 2xl:max-w-[25%] shadow-2xl h-full flex flex-col fixed bottom-[calc(4rem+1.5rem)] overflow-hidden right-0 mr-4 bg-white border-[#e5e7eb]`}
      >
        <div className="flex gap-2 p-3 text-lg font-bold bg-[#a855f7] items-center shadow-xl justify-between">
          <div className="flex gap-2 items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center p-2"
              style={{
                background: "linear-gradient(to right, #ffffff, #ed6c02)",
              }}
            >
              <Bot className="w-6 h-6 text-gray-700" />
            </div>
            <span>Emily</span>
          </div>

          {/* Streaming toggle button */}
          <Button
            onClick={() => setStreaming(!streaming)}
            size="sm"
            className={`rounded-full ${
              streaming
                ? "bg-green-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
            title={streaming ? "Streaming ON" : "Streaming OFF"}
          >
            {streaming ? "⚡ Live" : "📝 Standard"}
          </Button>
        </div>

        <div
          ref={convRef}
          className={`flex-grow h-[90%] items-start relative ${
            isOpen ? "" : "hidden"
          } p-4 overflow-y-auto flex flex-col`}
          style={{ minWidth: "100%" }}
          onScroll={handleScroll}
        >
          {conversations.map(({ who, what }, index) => (
            <Conversation key={index} who={who} what={what} />
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
              className="flex h-9 md:h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
              placeholder="Type your message"
              value={request}
              onChange={(e) => {
                if (!isOpen) setIsOpen(true);
                setRequest(e.target.value);
              }}
              disabled={loading || isTyping}
            />
            <Button
              disabled={loading || isTyping}
            >
              {loading ? "..." : isTyping ? "Typing..." : "Ask"}
            </Button>
          </form>
        </div>
      </div>
      <button
        className={`${
          isOpen ? "" : "animate-bounce"
        } hover:animate-none fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-12 h-12 md:w-16 md:h-16 bg-[#a855f7] hover:opacity-90 m-0 cursor-pointer border-none bg-none p-0 normal-case leading-5 hover:text-gray-900`}
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
          <Bot className="w-8 h-8 text-white" />
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
