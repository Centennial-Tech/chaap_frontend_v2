import { useEffect, useRef, useState } from "react";
import { Config } from "../../constants";
import ChatLoader from "../../components/ChatLoader";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import {
  ContentCopyOutlined,
  StopRounded,
  ThumbDown,
  ThumbDownAltOutlined,
  ThumbUp,
  ThumbUpAltOutlined,
  VolumeUpOutlined,
  OpenInFullOutlined,
  CloseFullscreenOutlined,
} from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import useCustomSpeech from "../../hooks/useCustomSpeech";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import supersub from "remark-supersub";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nord } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Brain } from "lucide-react";

interface Response {
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

const components: any = {
  code({ node, ...props }: { node: any; [key: string]: any }) {
    let language;
    if (props.className) {
      const match = props.className.match(/language-(\w+)/);
      language = match ? match[1] : undefined;
    }
    const codeString = node.children[0].value ?? "";
    return (
      <SyntaxHighlighter
        style={nord}
        language={language}
        PreTag="div"
        {...props}
      >
        {codeString}
      </SyntaxHighlighter>
    );
  },
};

const AI = ({
  content,
  loading = false,
  ref = () => {},
  isTyping = false,
}: Response & { isTyping?: boolean }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [unliked, setUnliked] = useState<boolean>(false);
  const { start, stop, speechStatus } = useCustomSpeech({ content });

  return (
    <div
      ref={ref}
      onClick={() => navigator.clipboard.writeText(content)}
      className="flex gap-3 my-4 text-gray-700 text-sm w-fit"
    >
      <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
        <div className="rounded-full bg-gray-100 border p-1">
          <Brain className="w-5 h-5 text-gray-700" />
        </div>
      </span>

      <div className="leading-relaxed flex flex-col gap-2 flex-1">
        <div className="flex justify-between">
          <span className="block font-bold text-gray-700 mr-3">
            Regulatory Agent
          </span>
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
        {loading ? (
          <ChatLoader />
        ) : (
          <div className="bg-blue-50 rounded-2xl rounded-tl-none p-4 shadow-lg">
            {isTyping ? (
              // Show content with streaming cursor during streaming
              <div className="whitespace-pre-wrap">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, supersub]}
                  children={content}
                  components={components}
                />
                <span className="animate-pulse">|</span>
              </div>
            ) : (
              // Show rendered markdown when streaming is complete
              <ReactMarkdown
                remarkPlugins={[remarkGfm, supersub]}
                children={content}
                components={components}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const KnowledgeAgent = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [request, setRequest] = useState<string>("");
  const [isMaximized, setIsMaximized] = useState<boolean>(true);
  const lastRef: any = useRef(null);
  const convRef: any = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userScrolledUp, setUserScrolledUp] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const suggestions = [
    "What is a predicate device in the 510(k) pathway?",
    "How can you help me?",
  ];

  const [conversations, setConversations] = useState<IConversation[]>([
    {
      who: "AI",
      what: "Hi! I'm your Regulatory Intelligence Agent with deep knowledge of FDA regulations, guidance documents, and submission processes. I can help you with:\n\n• FDA guidance interpretation\n\n• Regulation lookups and citations\n\n• Predicate device analysis\n\n• Compliance requirements\n\n• Historical precedent research\n\nWhat would you like to know?",
    },
  ]);

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

  // Auto-scroll when content updates, unless user scrolled up
  useEffect(() => {
    const hasStreamingMessage = conversations.some((conv) => conv.isStreaming);
    if (hasStreamingMessage && !userScrolledUp && convRef.current) {
      convRef.current.scrollTop = convRef.current.scrollHeight;
    }
  }, [conversations, userScrolledUp]);

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

  // Listen for sidebar toggle event
  useEffect(() => {
    const handleSidebarToggle = (event: CustomEvent) => {
      setIsOpen(event.detail.expanded);
    };

    window.addEventListener("sidebarToggle" as any, handleSidebarToggle);

    return () => {
      window.removeEventListener("sidebarToggle" as any, handleSidebarToggle);
    };
  }, []);

  const User = ({ content }: Response) => {
    return (
      <div className="flex gap-3 my-4 text-gray-700 text-sm self-end">
        <div className="leading-relaxed flex flex-col gap-2 flex-1">
          <span className="block font-bold text-gray-700 float-right self-end">
            You{" "}
          </span>
          <div className="bg-white rounded-2xl rounded-tr-none p-4 shadow-lg border border-gray-100">
            <span className="break-all">{content}</span>
          </div>
        </div>
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
      </div>
    );
  };

  const Conversation = ({ who, what, isTyping }: IConversation) => {
    if (who === "AI") return <AI content={what} isTyping={isTyping} />;
    else return <User content={what} />;
  };

  // Streaming function using Server-Sent Events with real-time updates
  const askBotStreaming = async (message: string) => {
    setLoading(true);

    // Add empty AI message immediately
    setConversations((prev) => [
      ...prev,
      {
        who: type.ai,
        what: "",
        isStreaming: true,
        isTyping: true,
      },
    ]);

    setLoading(false); // Stop loading since we now have the message placeholder

    try {
      const response = await fetch(`${Config.API}/agent/regulatory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request: message,
          stream: true,
          session_id: sessionId || undefined, // Use sessionId if available
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
                  // Update the last message with error
                  setConversations((prev) => {
                    const newConversations = [...prev];
                    const lastIndex = newConversations.length - 1;
                    if (newConversations[lastIndex]?.who === type.ai) {
                      newConversations[lastIndex] = {
                        ...newConversations[lastIndex],
                        what: "Sorry, an error occurred. Please try again.",
                        isStreaming: false,
                        isTyping: false,
                      };
                    }
                    return newConversations;
                  });
                  return;
                }

                if (data.content) {
                  accumulatedContent += data.content;

                  // Update the last AI message with accumulated content
                  setConversations((prev) => {
                    const newConversations = [...prev];
                    const lastIndex = newConversations.length - 1;
                    if (newConversations[lastIndex]?.who === type.ai) {
                      newConversations[lastIndex] = {
                        ...newConversations[lastIndex],
                        what: accumulatedContent,
                        isStreaming: true,
                        isTyping: true,
                      };
                    }
                    return newConversations;
                  });
                }

                if (data.done) {
                  // Finalize the message
                  setSessionId(data.session_id || null); // Update sessionId if provided
                  setConversations((prev) => {
                    const newConversations = [...prev];
                    const lastIndex = newConversations.length - 1;
                    if (newConversations[lastIndex]?.who === type.ai) {
                      newConversations[lastIndex] = {
                        ...newConversations[lastIndex],
                        what: accumulatedContent,
                        isStreaming: false,
                        isTyping: false,
                      };
                    }
                    return newConversations;
                  });
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
      // Update the last message with error
      setConversations((prev) => {
        const newConversations = [...prev];
        const lastIndex = newConversations.length - 1;
        if (newConversations[lastIndex]?.who === type.ai) {
          newConversations[lastIndex] = {
            ...newConversations[lastIndex],
            what: "Token limit reached. Please try again in a few seconds.",
            isStreaming: false,
            isTyping: false,
          };
        }
        return newConversations;
      });
    }
  };

  // Non-streaming function with typing effect
  // const askBot = async (message: string) => {
  //   setLoading(true);
  //   const aiMessageIndex = conversations.length + 1;

  //   try {
  //     const res = await axios.post(`${Config.API}/agent/regulatory`, {
  //       request: message,
  //       stream: false,
  //     });

  //     setLoading(false);
  //     // Add empty AI message after loading completes
  //     setConversations((prev: any) => [
  //       ...prev,
  //       {
  //         who: type.ai,
  //         what: "",
  //         isStreaming: true,
  //         isTyping: false,
  //       },
  //     ]);

  //     // Start typing effect with the response
  //     startTypingEffect(res.data.message, aiMessageIndex);
  //   } catch (error) {
  //     console.error("Error:", error);
  //     setLoading(false);
  //     // Add error message
  //     setConversations((prev: any) => [
  //       ...prev,
  //       {
  //         who: type.ai,
  //         what: "Token limit reached. Please try again in a few seconds.",
  //         isTyping: false,
  //         isStreaming: false,
  //       },
  //     ]);
  //   }
  // };

  const handleSubmit = (e: any) => {
    e?.preventDefault();

    // Don't submit if already loading or streaming, or if request is empty
    const hasStreamingMessage = conversations.some((conv) => conv.isStreaming);
    if (loading || hasStreamingMessage || request.length === 0) return;

    const newMessage = {
      who: type.user,
      what: request,
    };

    setConversations((prev: any) => [...prev, newMessage]);

    // Always use streaming
    askBotStreaming(request);

    setRequest("");
  };

  return (
    <div
      className={`flex flex-col h-[calc(100vh-5rem)] w-full ${
        isMaximized ? "p-6" : "p-0"
      } transition-all duration-500 ease-in-out`}
    >
      <div className="relative flex flex-col flex-grow w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div
          style={{
            background: "white",
          }}
          className={`
            h-full
            w-full
            flex 
            flex-col 
            overflow-hidden 
            rounded-xl
            shadow-lg 
            text-white
          `}
        >
          <div
            className={`
            flex gap-2 p-3 font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
            ${isMaximized ? "px-5 text-lg" : "px-3 text-base"} 
            items-center justify-between shadow-xl
            transition-[padding,font-size]
            duration-500
            ease-[cubic-bezier(0.25,0.1,0.25,1)]
          `}
          >
            <div className="flex gap-5 items-center">
              <div className="flex flex-col">
                <span
                  className={`
                  transition-[font-size,transform]
                  duration-500
                  ease-[cubic-bezier(0.25,0.1,0.25,1)]
                  transform-gpu
                  ${isMaximized ? "text-lg" : "text-base"}
                `}
                >
                  Regulatory Agent
                </span>
                <span
                  className={`
                  font-normal opacity-90
                  transition-[font-size,transform]
                  duration-500
                  ease-[cubic-bezier(0.25,0.1,0.25,1)]
                  transform-gpu
                  ${isMaximized ? "text-sm" : "text-xs"}
                `}
                >
                  Ask detailed questions about FDA regulations and processes
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip title={isMaximized ? "Minimize" : "Maximize"}>
                <div
                  onClick={toggleMaximize}
                  className="cursor-pointer hover:bg-white/10 p-1 rounded transition-all duration-300"
                >
                  {isMaximized ? (
                    <CloseFullscreenOutlined className="!w-5 !h-5 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] transform-gpu" />
                  ) : (
                    <OpenInFullOutlined className="!w-5 !h-5 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] transform-gpu" />
                  )}
                </div>
              </Tooltip>

              <Tooltip title="This is a Knowledge Agent.">
                <InfoOutlineIcon
                  className={`
                  transition-[width,height,transform]
                  duration-500
                  ease-[cubic-bezier(0.25,0.1,0.25,1)]
                  transform-gpu
                  ${isMaximized ? "" : "!w-5 !h-5"}
                `}
                />
              </Tooltip>
            </div>
          </div>

          <div
            ref={convRef}
            className={`
              flex-1
              ${isMaximized ? "p-4" : "px-4 py-3"} 
              overflow-y-auto 
              flex 
              flex-col 
              items-center
              bg-gray-50
              transition-[padding]
              duration-300
              ease-[cubic-bezier(0.4,0,0.2,1)]
            `}
            onScroll={handleScroll}
          >
            <div
              className={`
              w-[90%]
              max-w-[800px]
              flex 
              flex-col
              -ml-12
              transition-all
              duration-300
              ease-[cubic-bezier(0.4,0,0.2,1)]
            `}
            >
              {conversations.map(({ who, what, isTyping }, index) => (
                <Conversation
                  key={index}
                  who={who}
                  what={what}
                  isTyping={isTyping}
                />
              ))}
              {loading && <AI ref={lastRef} content="" loading />}
            </div>
          </div>

          <div
            className={`
            border-t bg-white
            transition-[padding,height]
            duration-300
            ease-[cubic-bezier(0.4,0,0.2,1)]
            transform-gpu
            ${isMaximized ? "p-4" : "p-3"}
          `}
          >
            <div
              className={`
              max-w-4xl mx-auto
              flex flex-col gap-3
              transition-[max-width,transform]
              duration-300
              ease-[cubic-bezier(0.4,0,0.2,1)]
              transform-gpu
            `}
            >
              <div
                className={`
                flex-wrap 
                flex 
                gap-2 
                w-full 
                justify-start 
                transition-[max-height,opacity,transform]
                duration-500
                ease-[cubic-bezier(0.25,0.1,0.25,1)]
                transform-gpu
                overflow-hidden
              `}
              >
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    size="small"
                    className="!border-dotted !rounded-full !normal-case !text-sm !min-h-[32px] hover:!bg-blue-50"
                    sx={{
                      borderColor: "rgb(62, 128, 246)",
                      color: "rgb(62, 128, 246)",
                      "&:hover": {
                        borderColor: "rgb(62, 128, 246)",
                        backgroundColor: "rgba(62, 128, 246, 0.1)",
                      },
                    }}
                    onClick={() => {
                      setRequest(suggestion);
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
              <form
                className="flex items-center justify-center w-full space-x-2"
                onSubmit={handleSubmit}
              >
                <input
                  autoFocus
                  className={`
                    flex-grow 
                    opacity-90
                    hover:opacity-100 
                    focus:opacity-100 
                    flex 
                    ${isMaximized ? "h-10" : "h-9"} 
                    w-full 
                    rounded-full 
                    border 
                    bg-blue-50
                    border-blue-100
                    outline-none 
                    shadow-md
                    hover:shadow-lg
                    focus:shadow-lg
                    ${isMaximized ? "px-4" : "px-3"}
                    py-2 
                    ${isMaximized ? "text-sm" : "text-xs"}
                    font-normal
                    placeholder-gray-500
                    focus:placeholder-gray-400
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-blue-400
                    focus:border-transparent
                    disabled:cursor-not-allowed 
                    disabled:opacity-50 
                    text-gray-800
                    focus-visible:ring-offset-2
                    transition-all
                    duration-200
                  `}
                  placeholder={
                    isMaximized
                      ? "Ask about FDA regulations, guidance documents, device classification..."
                      : "Ask about FDA regulations, guidance documents, device classification..."
                  }
                  value={request}
                  onChange={(e) => {
                    if (!isOpen) setIsOpen(true);
                    setRequest(e.target.value);
                  }}
                  disabled={
                    loading || conversations.some((conv) => conv.isStreaming)
                  }
                />
                <Button
                  disabled={
                    loading ||
                    conversations.some((conv) => conv.isStreaming) ||
                    request.length === 0
                  }
                  className={`${
                    request.length > 0 ? "opacity-100" : "opacity-0"
                  } !rounded-full !transition-all !duration-300 !h-10 !px-5 !text-sm`}
                  variant="contained"
                  size={isMaximized ? "medium" : "small"}
                  draggable={false}
                  type="submit"
                >
                  Send
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeAgent;
