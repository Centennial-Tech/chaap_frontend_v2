import SyntaxHighlighter from "react-syntax-highlighter";
import { nord } from "react-syntax-highlighter/dist/esm/styles/prism";

/**
 * Shared ReactMarkdown components for consistent formatting across all agents
 */
export const getMarkdownComponents = (): any => ({
  code({ node, className, children, ...props }: any) {
    let language;
    if (className) {
      const match = className.match(/language-(\w+)/);
      language = match ? match[1] : undefined;
    }
    const codeString = String(children).replace(/\n$/, '');
    return (
      <SyntaxHighlighter
        style={nord as any}
        language={language}
        PreTag="div"
        {...props}
      >
        {codeString}
      </SyntaxHighlighter>
    );
  },
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc pl-6 mb-4 [&_ul]:list-none [&_ul]:pl-4 [&_ul_ul]:list-disc [&_ul_ul]:pl-4" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal pl-6 mb-4" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="mb-2 [ul_ul_&]:before:content-['-_'] [ul_ul_&]:before:mr-2 [ul_ul_&]:before:font-bold" {...props}>
      {children}
    </li>
  ),
  p: ({ children, ...props }: any) => (
    <p className="mb-4" {...props}>
      {children}
    </p>
  ),
  h1: ({ children, ...props }: any) => (
    <h1 className="text-2xl font-semibold text-gray-900 mb-3 mt-6" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-xl font-semibold text-gray-900 mb-3 mt-5" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: any) => (
    <h4 className="text-base font-semibold text-gray-900 mb-2 mt-3" {...props}>
      {children}
    </h4>
  ),
}); 