import api from "../../api";
import AnimatedBackground from "../../components/AnimatedBackground";
import { useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../../components/Toast";
import { useAuth } from "../../provider/authProvider";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import supersub from "remark-supersub";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nord } from "react-syntax-highlighter/dist/esm/styles/prism";

interface PredictedReportType {
  type: string;
  dueDate?: string;
  description?: string;
}

interface GeneratedReport {
  id: string;
  type: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  createdAt: string;
  fileName: string;
  downloadUrl?: string;
}

interface FileContent {
  fileName: string;
  data: string[][];
  headers: string[];
  fileType: "csv" | "excel";
  uploadTime: string;
  totalRows: number;
  totalColumns: number;
}

interface PostMarketSurveillanceAgentProps {
  predictedReportType?: PredictedReportType;
  generatedReports?: GeneratedReport[];
}

const FormField = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const FormInput = ({
  placeholder,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    placeholder={placeholder}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
  />
);

const FormSelect = ({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
  >
    {children}
  </select>
);

const FormTextarea = ({
  placeholder,
  rows = 4,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    rows={rows}
    placeholder={placeholder}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-vertical"
  />
);

const Card = ({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) => (
  <div
    id={id}
    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
  >
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

// ReactMarkdown components for consistent formatting
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
};

const PostMarketSurveillanceAgent = ({
  generatedReports = [],
}: Pick<PostMarketSurveillanceAgentProps, "generatedReports">) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressStep, setProgressStep] = useState<string>("");
  const [progressSteps, setProgressSteps] = useState<string[]>([]);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [capaData, setCapaData] = useState<any>(null);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [showAllReports, setShowAllReports] = useState(false);
  const [metrics, setMetrics] = useState({
    dueToday: 0,
    dueThisWeek: 0,
    openCapa: 0,
  });

  // Calculate metrics from reports
  const calculateMetrics = (reports: any[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7);

    const newMetrics = {
      dueToday: 0,
      dueThisWeek: 0,
      openCapa: 0,
    };

    reports.forEach((report) => {
      if (report.due_date) {
        const dueDate = new Date(report.due_date);
        dueDate.setHours(0, 0, 0, 0);

        if (dueDate.getTime() === today.getTime()) {
          newMetrics.dueToday++;
        } else if (dueDate > today && dueDate <= endOfWeek) {
          newMetrics.dueThisWeek++;
        }
      }

      if (report.is_capa && report.status !== "completed") {
        newMetrics.openCapa++;
      }
    });

    setMetrics(newMetrics);
  };

  // Toast notifications
  const toast = useToast();
  const { user } = useAuth();

  // Check if all required fields are filled
  const isFormValid = () => {
    const requiredFields = [
      "productType",
      "productName",
      "lotNumber",
      "indication",
      "eventDescription",
      "eventDate",
      "eventOutcome",
      "reporterLocation",
    ];

    const fieldsValid = requiredFields.every((field) => {
      const value = formData[field as keyof typeof formData];
      return value && value.toString().trim() !== "";
    });

    // Also require file to be uploaded
    return fieldsValid && fileContent !== null;
  };

  // Get missing required fields for better user feedback
  const getMissingFields = () => {
    const requiredFields = [
      { key: "productType", label: "Product Type" },
      { key: "productName", label: "Product Name" },
      { key: "lotNumber", label: "Lot Number" },
      { key: "indication", label: "Indication" },
      { key: "eventDescription", label: "Event Description" },
      { key: "eventDate", label: "Date of Event" },
      { key: "eventOutcome", label: "Event Outcome" },
      { key: "reporterLocation", label: "Reporter Location" },
    ];

    const missingFields = requiredFields.filter((field) => {
      const value = formData[field.key as keyof typeof formData];
      return !value || value.toString().trim() === "";
    });

    // Add file upload requirement
    if (!fileContent) {
      missingFields.push({
        key: "fileUpload",
        label: "File Upload (CSV/Excel)",
      });
    }

    return missingFields;
  };

  // Form data state
  const [formData, setFormData] = useState({
    productType: "",
    productName: "",
    lotNumber: "",
    indication: "",
    manufacturer: "",
    eventDescription: "",
    eventDate: "",
    eventOutcome: "",
    severityClassification: "",
    reporterType: "",
    reporterLocation: "",
    manufacturerResponse: "",
    capaRequired: false,
  });

  useEffect(() => {
    const getRecentReports = async () => {
      if (!user?.id) return;

      setIsLoadingReports(true);
      try {
        const res = await api.post(
          "/agent/post_market_surveillance/get_post_market_data",
          {
            user_id: user.id,
          }
        );

        const recentReportsData = res.data?.data?.data || [];
        setRecentReports(recentReportsData);
        calculateMetrics(recentReportsData);
      } catch (error) {
        console.error("Error fetching recent reports:", error);
        toast.error("Failed to load recent reports");
      } finally {
        setIsLoadingReports(false);
      }
    };

    getRecentReports();
  }, [user?.id]);

  // Utility function to copy text to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Report content copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast.error("Failed to copy to clipboard. Please try again.");
    }
  };

  // Helper function to convert markdown to HTML for Word documents
  const markdownToHtml = (markdown: string): string => {
    const lines = markdown.split('\n');
    let result = [];
    let currentList = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        // Empty line - close any open list
        if (inList && currentList.length > 0) {
          result.push(`<ul style="margin: 8px 0; padding-left: 20px;">${currentList.join('')}</ul>`);
          currentList = [];
          inList = false;
        }
        result.push('<br>');
        continue;
      }

      // Check for headers
      if (line.startsWith('# ')) {
        if (inList && currentList.length > 0) {
          result.push(`<ul style="margin: 8px 0; padding-left: 20px;">${currentList.join('')}</ul>`);
          currentList = [];
          inList = false;
        }
        const content = line.substring(2)
          .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold; color: #1f2937;">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #4b5563;">$1</em>')
          .replace(/`(.*?)`/g, '<code style="background-color: #f3f4f6; color: #374151; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 14px;">$1</code>');
        result.push(`<h1 style="font-size: 24px; font-weight: bold; color: #1f2937; margin: 20px 0 10px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">${content}</h1>`);
      } else if (line.startsWith('## ')) {
        if (inList && currentList.length > 0) {
          result.push(`<ul style="margin: 8px 0; padding-left: 20px;">${currentList.join('')}</ul>`);
          currentList = [];
          inList = false;
        }
        const content = line.substring(3)
          .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold; color: #1f2937;">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #4b5563;">$1</em>')
          .replace(/`(.*?)`/g, '<code style="background-color: #f3f4f6; color: #374151; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 14px;">$1</code>');
        result.push(`<h2 style="font-size: 20px; font-weight: bold; color: #374151; margin: 16px 0 8px 0;">${content}</h2>`);
      } else if (line.startsWith('### ')) {
        if (inList && currentList.length > 0) {
          result.push(`<ul style="margin: 8px 0; padding-left: 20px;">${currentList.join('')}</ul>`);
          currentList = [];
          inList = false;
        }
        const content = line.substring(4)
          .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold; color: #1f2937;">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #4b5563;">$1</em>')
          .replace(/`(.*?)`/g, '<code style="background-color: #f3f4f6; color: #374151; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 14px;">$1</code>');
        result.push(`<h3 style="font-size: 18px; font-weight: bold; color: #4b5563; margin: 14px 0 7px 0;">${content}</h3>`);
      } else if (line.startsWith('#### ')) {
        if (inList && currentList.length > 0) {
          result.push(`<ul style="margin: 8px 0; padding-left: 20px;">${currentList.join('')}</ul>`);
          currentList = [];
          inList = false;
        }
        const content = line.substring(5)
          .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold; color: #1f2937;">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #4b5563;">$1</em>')
          .replace(/`(.*?)`/g, '<code style="background-color: #f3f4f6; color: #374151; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 14px;">$1</code>');
        result.push(`<h4 style="font-size: 16px; font-weight: bold; color: #6b7280; margin: 12px 0 6px 0;">${content}</h4>`);
      }
      // Check for bullet points
      else if (line.startsWith('- ')) {
        inList = true;
        const content = line.substring(2)
          .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold; color: #1f2937;">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #4b5563;">$1</em>')
          .replace(/`(.*?)`/g, '<code style="background-color: #f3f4f6; color: #374151; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 14px;">$1</code>');
        currentList.push(`<li style="margin: 4px 0; color: #4b5563;">${content}</li>`);
      }
      // Check for numbered lists
      else if (line.match(/^\d+\. /)) {
        inList = true;
        const match = line.match(/^(\d+)\. (.*)/);
        if (match) {
          const number = match[1];
          const content = match[2]
            .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold; color: #1f2937;">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #4b5563;">$1</em>')
            .replace(/`(.*?)`/g, '<code style="background-color: #f3f4f6; color: #374151; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 14px;">$1</code>');
          currentList.push(`<li style="margin: 4px 0; color: #4b5563;">${number}. ${content}</li>`);
        }
      }
      // Regular text
      else {
        if (inList && currentList.length > 0) {
          result.push(`<ul style="margin: 8px 0; padding-left: 20px;">${currentList.join('')}</ul>`);
          currentList = [];
          inList = false;
        }
        const content = line
          .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold; color: #1f2937;">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #4b5563;">$1</em>')
          .replace(/`(.*?)`/g, '<code style="background-color: #f3f4f6; color: #374151; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 14px;">$1</code>');
        result.push(`<p style="margin: 8px 0; line-height: 1.6; color: #374151;">${content}</p>`);
      }
    }

    // Close any remaining list
    if (inList && currentList.length > 0) {
      result.push(`<ul style="margin: 8px 0; padding-left: 20px;">${currentList.join('')}</ul>`);
    }

    return result.join('');
  };

  // Helper function to strip markdown formatting for plain text
  const stripMarkdown = (markdown: string): string => {
    return markdown
      // Remove headers (keep the text)
      .replace(/^#{1,4}\s+(.*$)/gim, '$1\n')
      // Remove bold and italic markers
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      // Remove inline code markers
      .replace(/`(.*?)`/g, '$1')
      // Convert bullet points to simple dashes
      .replace(/^- (.*$)/gim, '- $1')
      // Keep numbered lists as is
      .replace(/^(\d+)\. (.*$)/gim, '$1. $2')
      // Remove extra whitespace and normalize line breaks
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
  };

  // Enhanced download document functions with proper formatting
  const downloadDocument = async (format: "pdf" | "doc" | "txt", reportData: any, reportType: "adverse" | "capa" = "adverse") => {
    if (!reportData?.generated_report) return;

    let blob: Blob;
    let filename = reportType === "capa" 
      ? `CAPA_Report_${new Date().toISOString().split("T")[0]}.${format}`
      : `${reportData.predicted_report || "Adverse_Event_Report"}_${new Date().toISOString().split("T")[0]}.${format}`;

    if (format === "pdf") {
      await generateStyledPDF(reportData, filename, reportType);
      return;
    } else if (format === "doc") {
      const htmlContent = markdownToHtml(reportData.generated_report);
      const docContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>${reportType === "capa" ? "CAPA Report" : "Adverse Event Report"}</title>
          <style>
            body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 12pt; line-height: 1.5; color: #333; margin: 0.25in; }
            h1, h2, h3, h4 { margin-top: 16px; margin-bottom: 8px; }
            h1 { margin-top: 12px; }
            ul, ol { margin: 8px 0; padding-left: 20px; }
            li { margin: 3px 0; }
            p { margin: 6px 0; }
            code { background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: 'Courier New', monospace; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `;
      blob = new Blob([docContent], { type: "application/msword" });
    } else {
      // For TXT format, strip all markdown formatting
      const plainText = stripMarkdown(reportData.generated_report);
      blob = new Blob([plainText], { type: "text/plain" });
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Generate styled PDF with proper formatting
  const generateStyledPDF = async (reportData: any, filename: string, reportType: "adverse" | "capa" = "adverse") => {
    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

    // PDF styling constants
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 6;
    const maxLineWidth = pageWidth - margin * 2;

    let yPosition = margin;

    // Add header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    const title = reportType === "capa" ? "CAPA REPORT" : "ADVERSE EVENT REPORT";
    doc.text(title, margin, yPosition);
    yPosition += 15;

    // Add a line separator
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Helper function to clean markdown from text
    const cleanMarkdown = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
        .replace(/\*(.*?)\*/g, '$1')     // Remove italic markers  
        .replace(/`(.*?)`/g, '$1');      // Remove code markers
    };

    // Helper function to render text with inline formatting
    const renderFormattedText = (text: string, x: number, y: number, fontSize: number = 12, color: [number, number, number] = [60, 60, 60]) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      
      // First, clean any remaining markdown that wasn't properly parsed
      let cleanText = text
        .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove any remaining **text**
        .replace(/\*(.*?)\*/g, '$1')      // Remove any remaining *text*
        .replace(/`(.*?)`/g, '$1');       // Remove any remaining `text`
      
      // Handle mixed formatting in the same line
      let currentX = x;
      
      // Split by markdown patterns while preserving the delimiters and content
      const markdownRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
      const segments = cleanText.split(markdownRegex);
      
      for (const segment of segments) {
        if (!segment) continue;
        
        if (segment.startsWith("**") && segment.endsWith("**")) {
          // Bold text
          const boldText = segment.slice(2, -2);
          doc.setFont("helvetica", "bold");
          const textWidth = doc.getTextWidth(boldText);
          doc.text(boldText, currentX, y);
          currentX += textWidth;
          doc.setFont("helvetica", "normal");
        } else if (segment.startsWith("*") && segment.endsWith("*") && !segment.startsWith("**")) {
          // Italic text
          const italicText = segment.slice(1, -1);
          doc.setFont("helvetica", "italic");
          const textWidth = doc.getTextWidth(italicText);
          doc.text(italicText, currentX, y);
          currentX += textWidth;
          doc.setFont("helvetica", "normal");
        } else if (segment.startsWith("`") && segment.endsWith("`")) {
          // Inline code
          const codeText = segment.slice(1, -1);
          doc.setFont("courier", "normal");
          doc.setTextColor(100, 100, 100);
          const textWidth = doc.getTextWidth(codeText);
          doc.text(codeText, currentX, y);
          currentX += textWidth;
          doc.setFont("helvetica", "normal");
          doc.setTextColor(color[0], color[1], color[2]);
        } else {
          // Regular text - clean any remaining markdown
          const finalCleanText = segment
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/`(.*?)`/g, '$1');
          doc.setFont("helvetica", "normal");
          const textWidth = doc.getTextWidth(finalCleanText);
          doc.text(finalCleanText, currentX, y);
          currentX += textWidth;
        }
      }
      
      return currentX - x; // Return the total width used
    };

    // Helper function to render multi-line formatted text
    const renderMultiLineFormattedText = (text: string, x: number, startY: number, fontSize: number = 12, color: [number, number, number] = [60, 60, 60]) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.setFont("helvetica", "normal");
      
      let currentY = startY;
      const words = text.split(' ');
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        // Test with cleaned text to check actual width
        const cleanTestLine = cleanMarkdown(testLine);
        const testWidth = doc.getTextWidth(cleanTestLine);
        
        if (testWidth <= maxLineWidth) {
          currentLine = testLine;
        } else {
          // Render current line if it has content
          if (currentLine) {
            renderFormattedText(currentLine, x, currentY, fontSize, color);
            currentY += lineHeight;
          }
          currentLine = word;
        }
      }
      
      // Render remaining text
      if (currentLine) {
        renderFormattedText(currentLine, x, currentY, fontSize, color);
        currentY += lineHeight;
      }
      
      return currentY; // Return the final Y position
    };

    // Parse markdown-like content
    const content = reportData.generated_report || "No content available";
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check if we need a new page (leave more space for footer)
      if (yPosition > pageHeight - margin - 20) {
              doc.addPage();
        yPosition = margin;
      }

      if (!line) {
        yPosition += lineHeight / 2; // Small space for empty lines
        continue;
      }

      // Handle headers
      if (line.startsWith("# ")) {
        const headerText = line.substring(2);
        doc.setFontSize(18);
        doc.setTextColor(50, 50, 50);
        doc.setFont("helvetica", "bold");
        const wrappedHeader = doc.splitTextToSize(headerText, maxLineWidth);
        doc.text(wrappedHeader, margin, yPosition);
        yPosition += wrappedHeader.length * lineHeight + 5;
      } else if (line.startsWith("## ")) {
        const headerText = line.substring(3);
        doc.setFontSize(16);
        doc.setTextColor(60, 60, 60);
        doc.setFont("helvetica", "bold");
        const wrappedHeader = doc.splitTextToSize(headerText, maxLineWidth);
        doc.text(wrappedHeader, margin, yPosition);
        yPosition += wrappedHeader.length * lineHeight + 4;
      } else if (line.startsWith("### ")) {
        const headerText = line.substring(4);
        doc.setFontSize(14);
        doc.setTextColor(70, 70, 70);
        doc.setFont("helvetica", "bold");
        const wrappedHeader = doc.splitTextToSize(headerText, maxLineWidth);
        doc.text(wrappedHeader, margin, yPosition);
        yPosition += wrappedHeader.length * lineHeight + 3;
      } else if (line.startsWith("#### ")) {
        const headerText = line.substring(5);
        doc.setFontSize(13);
        doc.setTextColor(80, 80, 80);
        doc.setFont("helvetica", "bold");
        const wrappedHeader = doc.splitTextToSize(headerText, maxLineWidth);
        doc.text(wrappedHeader, margin, yPosition);
        yPosition += wrappedHeader.length * lineHeight + 2;
      }
      // Handle bullet points
      else if (line.startsWith("- ") || line.startsWith("* ")) {
        const bulletText = line.substring(2);
        doc.setFontSize(12);
        doc.setTextColor(80, 80, 80);
        doc.setFont("helvetica", "normal");
        
        // Add bullet point
        doc.text("• ", margin + 5, yPosition);
        
        // Check if the bullet text contains formatting
        if (bulletText.includes("**") || bulletText.includes("*") || bulletText.includes("`")) {
          // Use multi-line formatted text rendering
          const finalY = renderMultiLineFormattedText(bulletText, margin + 10, yPosition, 12, [80, 80, 80]);
          yPosition = finalY + 2;
        } else {
          // Simple text wrapping for plain text
          const wrappedBullet = doc.splitTextToSize(bulletText, maxLineWidth - 10);
          doc.text(wrappedBullet, margin + 10, yPosition);
          yPosition += wrappedBullet.length * lineHeight + 2;
        }
      }
      // Handle numbered lists
      else if (line.match(/^\d+\. /)) {
        const match = line.match(/^(\d+\. )(.*)/);
        if (match) {
          const listNumber = match[1];
          const listText = match[2];
          
          doc.setFontSize(12);
          doc.setTextColor(80, 80, 80);
          doc.setFont("helvetica", "normal");
          
          // Add list number
          doc.text(listNumber, margin + 5, yPosition);
          const numberWidth = doc.getTextWidth(listNumber);
          
          // Check if the list text contains formatting
          if (listText.includes("**") || listText.includes("*") || listText.includes("`")) {
            // Use multi-line formatted text rendering
            const finalY = renderMultiLineFormattedText(listText, margin + 5 + numberWidth, yPosition, 12, [80, 80, 80]);
            yPosition = finalY + 2;
          } else {
            // Simple text wrapping for plain text
            const wrappedText = doc.splitTextToSize(listText, maxLineWidth - 5 - numberWidth);
            doc.text(wrappedText, margin + 5 + numberWidth, yPosition);
            yPosition += wrappedText.length * lineHeight + 2;
          }
        }
      }
      // Handle code blocks
      else if (line.startsWith("```")) {
          doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.setFont("courier", "normal");

        // Find the end of code block
        let codeContent = "";
        let j = i + 1;
        while (j < lines.length && !lines[j].startsWith("```")) {
          codeContent += lines[j] + "\n";
          j++;
        }

        // Draw code block background
        const codeHeight = (codeContent.split("\n").length - 1) * lineHeight + 8;
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, yPosition - 3, maxLineWidth, codeHeight, "F");

        const wrappedCode = doc.splitTextToSize(codeContent.trim(), maxLineWidth - 10);
        doc.text(wrappedCode, margin + 5, yPosition + 2);
        yPosition += wrappedCode.length * lineHeight + 10;

        i = j; // Skip processed lines
      }
      // Regular text with potential formatting
      else {
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.setFont("helvetica", "normal");
        
        // Check if line contains formatting
        if (line.includes("**") || line.includes("*") || line.includes("`")) {
          // Use multi-line formatted text rendering
          const finalY = renderMultiLineFormattedText(line, margin, yPosition, 12, [60, 60, 60]);
          yPosition = finalY + 3;
        } else {
          // Plain text without formatting
          const wrappedText = doc.splitTextToSize(line, maxLineWidth);
          doc.text(wrappedText, margin, yPosition);
          yPosition += wrappedText.length * lineHeight + 3;
        }
      }
    }

    // Add footer with page numbers
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
        doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
        doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - margin - 20,
        pageHeight - 15
      );

      // Add timestamp
      const timestamp = new Date().toLocaleDateString();
      doc.text(`Generated on ${timestamp}`, margin, pageHeight - 15);
    }

      doc.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  // Function to download report as PDF (legacy function for backward compatibility)
  const downloadReportAsPDF = async (
    reportData: any,
    reportType: "adverse" | "capa" = "adverse"
  ) => {
    try {
      await downloadDocument("pdf", reportData, reportType);
      toast.success("PDF report downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(
        "Failed to generate PDF. Downloading as text file instead...",
        6000
      );

      // Fallback to text download
      await downloadDocument("txt", reportData, reportType);
    }
  };

  // Function to download historical reports
  const downloadHistoricalReport = async (reportData: any) => {
    const reportContent = reportData.content || reportData;

    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      // Set up PDF styling
      doc.setFontSize(20);
      const title = reportData.is_capa
        ? "CORRECTIVE AND PREVENTIVE ACTION REPORT"
        : "ADVERSE EVENT REPORT";
      doc.text(title, 20, 30);

      doc.setFontSize(12);
      doc.text(
        `Generated on: ${new Date(reportData.timestamp).toLocaleDateString()}`,
        20,
        45
      );

      let yPosition = 60;
      const lineHeight = 8;
      const maxWidth = 170;

      if (reportData.is_capa) {
        // Corrective and Preventive Action Report Format
        doc.setFontSize(14);
        doc.text("Corrective and Preventive Action Report", 20, yPosition);
        yPosition += lineHeight * 2;

        doc.setFontSize(10);
        const capaContent =
          reportContent.generated_report ||
          "No Corrective and Preventive Action content available";
        const capaLines = doc.splitTextToSize(capaContent, maxWidth);
        capaLines.forEach((line: string) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, 20, yPosition);
          yPosition += lineHeight;
        });

        // Due Date
        if (reportContent.due_date) {
          yPosition += lineHeight;
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.setFontSize(12);
          doc.text(`Due Date: ${reportContent.due_date}`, 20, yPosition);
        }
      } else {
        // Adverse Event Report Format
        doc.setFontSize(14);
        doc.text("Report Type:", 20, yPosition);
        doc.setFontSize(12);
        doc.text(reportContent.predicted_report || "N/A", 70, yPosition);
        yPosition += lineHeight * 2;

        // Product Information
        doc.setFontSize(14);
        doc.text("Product Information:", 20, yPosition);
        yPosition += lineHeight;

        doc.setFontSize(10);
        const productInfo = [
          `Product Type: ${reportData.product_type}`,
          `Product Name: ${reportData.product_name}`,
          `Lot Number: ${reportData.lot_number}`,
          `Indication: ${reportData.indication}`,
        ];

        productInfo.forEach((info) => {
          doc.text(info, 25, yPosition);
          yPosition += lineHeight;
        });
        yPosition += lineHeight;

        // Event Details
        doc.setFontSize(14);
        doc.text("Event Details:", 20, yPosition);
        yPosition += lineHeight;

        doc.setFontSize(10);
        const eventInfo = [
          `Date of Event: ${reportData.date_of_event}`,
          `Event Outcome: ${reportData.event_outcome}`,
          `Severity: ${reportData.severity_classification}`,
          `Reporter Type: ${reportData.reporter_type}`,
          `Reporter Location: ${reportData.reporter_location}`,
        ];

        eventInfo.forEach((info) => {
          doc.text(info, 25, yPosition);
          yPosition += lineHeight;
        });
        yPosition += lineHeight;

        // Event Description
        if (reportData.event_description) {
          doc.setFontSize(14);
          doc.text("Event Description:", 20, yPosition);
          yPosition += lineHeight;

          doc.setFontSize(10);
          const descriptionLines = doc.splitTextToSize(
            reportData.event_description,
            maxWidth
          );
          descriptionLines.forEach((line: string) => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(line, 25, yPosition);
            yPosition += lineHeight;
          });
          yPosition += lineHeight;
        }

        // AI Generated Analysis
        doc.setFontSize(14);
        doc.text("AI Generated Analysis:", 20, yPosition);
        yPosition += lineHeight;

        doc.setFontSize(10);
        const analysisLines = doc.splitTextToSize(
          reportContent.generated_report || "No analysis available",
          maxWidth
        );
        analysisLines.forEach((line: string) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, 25, yPosition);
          yPosition += lineHeight;
        });

        // Manufacturer Response
        if (reportData.manufacturer_response) {
          yPosition += lineHeight;
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(14);
          doc.text("Manufacturer Response:", 20, yPosition);
          yPosition += lineHeight;

          doc.setFontSize(10);
          const responseLines = doc.splitTextToSize(
            reportData.manufacturer_response,
            maxWidth
          );
          responseLines.forEach((line: string) => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(line, 25, yPosition);
            yPosition += lineHeight;
          });
        }
      }

      // Footer
      yPosition += lineHeight * 2;
      doc.setFontSize(8);
      doc.text(
        `Generated at: ${new Date(reportData.timestamp).toLocaleString()}`,
        20,
        yPosition
      );

      // Save the PDF
      const fileName = reportData.is_capa
        ? `Corrective_and_Preventive_Action_Report_${reportData.product_name}_${
            new Date(reportData.timestamp).toISOString().split("T")[0]
          }.pdf`
        : `${reportContent.predicted_report || "Adverse_Event_Report"}_${
            reportData.product_name
          }_${new Date(reportData.timestamp).toISOString().split("T")[0]}.pdf`;
      doc.save(fileName);

      toast.success("Historical report downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  // Function to reset form for new report
  const startNewReport = () => {
    setFormData({
      productType: "",
      productName: "",
      lotNumber: "",
      indication: "",
      manufacturer: "",
      eventDescription: "",
      eventDate: "",
      eventOutcome: "",
      severityClassification: "",
      reporterType: "",
      reporterLocation: "",
      manufacturerResponse: "",
      capaRequired: false,
    });
    setUploadedFile(null);
    setFileContent(null);
    setGeneratedData(null);
    setCapaData(null);
    toast.info("Started new report. Please fill out the form.");
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setProgressSteps([]);
    setProgressStep("Validating form data...");

    try {
      // Step 1: Validate required fields
      setProgressStep("Validating form data...");
      setProgressSteps((prev) => [...prev, "✓ Validating form data..."]);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const requiredFields = [
        "productType",
        "productName",
        "lotNumber",
        "indication",
        "eventDescription",
        "eventDate",
        "eventOutcome",
        "reporterLocation",
      ];

      const missingFields = requiredFields.filter(
        (field) => !formData[field as keyof typeof formData]
      );

      if (missingFields.length > 0 || !fileContent) {
        toast.error(
          `Please fill in the following required fields: ${missingFields.join(
            ", "
          )} ${!fileContent ? " and upload a file" : ""}`
        );
        setIsSubmitting(false);
        setProgressStep("");
        setProgressSteps([]);
        return;
      }

      // Step 2: Understanding your data
      setProgressStep("Understanding your data...");
      setProgressSteps((prev) => [...prev, "✓ Understanding your data..."]);
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Step 3: Preparing submission data
      setProgressStep("Preparing submission data...");
      setProgressSteps((prev) => [...prev, "✓ Preparing submission data..."]);
      await new Promise((resolve) => setTimeout(resolve, 600));

      //       {
      //     "productType": "drug",
      //     "productName": "feuscoby",
      //     "lotNumber": "uowdb",
      //     "indication": "oubwf",
      //     "manufacturer": "juf",
      //     "eventDescription": "jobefojb",
      //     "eventDate": "1999-04-02",
      //     "eventOutcome": "Death",
      //     "severityClassification": "Serious",
      //     "reporterType": "healthcare-professional",
      //     "reporterLocation": "United States",
      //     "manufacturerResponse": "uefiefn",
      //     "capaRequired": true,
      //     "uploadedFileData": null,
      //     "submittedAt": "2025-07-21T18:34:58.709Z"
      // }
      // Prepare submission data

      const submissionData = {
        product_type: formData.productType,
        product_name: formData.productName,
        lot_number: formData.lotNumber,
        indication: formData.indication,
        manufacturer: formData.manufacturer,
        event_description: formData.eventDescription,
        date_of_event: formData.eventDate,
        event_outcome: formData.eventOutcome,
        severity_classification: formData.severityClassification,
        reporter_type: formData.reporterType,
        reporter_location: formData.reporterLocation,
        manufacturer_response: formData.manufacturerResponse,
        is_capa: formData.capaRequired,
        file_info: fileContent?.data,
        submittedAt: new Date().toISOString(),
        user_id: user?.id,
      };

      // Step 4: Generating adverse event report
      setProgressStep("Generating adverse event report...");
      setProgressSteps((prev) => [
        ...prev,
        "✓ Generating adverse event report...",
      ]);

      const response = await api.post(
        `/agent/post_market_surveillance/analyze?type=ADVERSE_REPORT`,
        { ...submissionData, is_capa: false }
      );

      setGeneratedData(response.data?.messages[0]);
      setProgressSteps((prev) => [...prev, "✓ Adverse event report generated"]);

      if (formData.capaRequired) {
        // Step 5: Generating CAPA analysis
        setProgressStep(
          "Generating Corrective and Preventive Action analysis..."
        );
        setProgressSteps((prev) => [
          ...prev,
          "✓ Generating Corrective and Preventive Action analysis...",
        ]);

        const capResponse = await api.post(
          `/agent/post_market_surveillance/analyze?type=CAPA_GENERATION`,
          submissionData
        );

        setCapaData(capResponse.data?.messages[0]);
        setProgressSteps((prev) => [
          ...prev,
          "✓ Corrective and Preventive Action analysis completed",
        ]);
      }

      // Step 6: Finalizing report
      setProgressStep("Finalizing report...");
      setProgressSteps((prev) => [...prev, "✓ Finalizing report..."]);
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("Submitting adverse event report:", submissionData);

      // Success handling
      const successMessage = formData.capaRequired
        ? "Adverse event report and Corrective and Preventive Action analysis generated successfully!"
        : "Adverse event report generated successfully!";
      toast.success(successMessage);

      // Update metrics with the new report
      const newReport = {
        ...submissionData,
        due_date: response.data?.messages[0]?.due_date,
        status: "pending",
        timestamp: new Date().toISOString(),
        content: response.data?.messages[0],
      };

      const updatedReports = [...recentReports, newReport];
      setRecentReports(updatedReports);
      calculateMetrics(updatedReports);

      // Scroll to the Predicted Report Type section to show generated report
      const predictedReportSection = document.getElementById(
        "predicted-report-section"
      );
      if (predictedReportSection) {
        predictedReportSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      // Reset form after successful report generation
      // startNewReport();
      // User can manually reset if needed

      setProgressSteps((prev) => [
        ...prev,
        "✓ Report generation completed successfully!",
      ]);
      setProgressStep("Complete!");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Error generating report. Please try again.");
      setProgressStep("Error occurred during report generation");
      setProgressSteps((prev) => [
        ...prev,
        "✗ Error occurred during report generation",
      ]);
    } finally {
      setIsSubmitting(false);
      // Clear progress after a delay
      setTimeout(() => {
        setProgressStep("");
        setProgressSteps([]);
      }, 3000);
    }
  };

  const parseCSV = (csvText: string): string[][] => {
    const lines = csvText.split("\n");
    const result: string[][] = [];

    for (let line of lines) {
      if (line.trim() === "") continue;

      const row: string[] = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"' && (i === 0 || line[i - 1] !== "\\")) {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          row.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }

      row.push(current.trim());
      result.push(row);
    }

    return result;
  };

  const parseExcel = async (file: File): Promise<string[][]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);

          // Import XLSX dynamically
          import("xlsx")
            .then((XLSX) => {
              const workbook = XLSX.read(data, { type: "array" });
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];

              // Convert to array of arrays
              const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
                defval: "",
                raw: false,
              }) as string[][];

              console.log("Parsed Excel data:", jsonData);
              resolve(jsonData);
            })
            .catch((error) => {
              console.error("Error importing XLSX:", error);
              reject(
                new Error(
                  "Failed to load Excel parser. Please install xlsx library."
                )
              );
            });
        } catch (error) {
          console.error("Error parsing Excel file:", error);
          reject(new Error("Failed to parse Excel file"));
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });
  };

  const readFileContent = async (
    file: File
  ): Promise<{ data: string[][]; headers: string[] }> => {
    const isCSV = file.name.toLowerCase().endsWith(".csv");
    const isExcel =
      file.name.toLowerCase().endsWith(".xlsx") ||
      file.name.toLowerCase().endsWith(".xls");

    if (!isCSV && !isExcel) {
      throw new Error(
        "Unsupported file type. Please upload CSV or Excel files."
      );
    }

    try {
      let parsedData: string[][];

      if (isCSV) {
        const text = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = () => reject(new Error("Failed to read CSV file"));
          reader.readAsText(file);
        });

        parsedData = parseCSV(text);
      } else {
        parsedData = await parseExcel(file);
      }

      // Extract headers (first row) and data
      const headers = parsedData.length > 0 ? parsedData[0] : [];

      return {
        data: parsedData,
        headers: headers,
      };
    } catch (error) {
      console.error("Error processing file:", error);
      throw error;
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedFile(file);

    try {
      const isCSV = file.name.toLowerCase().endsWith(".csv");
      const isExcel =
        file.name.toLowerCase().endsWith(".xlsx") ||
        file.name.toLowerCase().endsWith(".xls");

      if (!isCSV && !isExcel) {
        throw new Error("Unsupported file type");
      }

      const { data, headers } = await readFileContent(file);
      const fileContentData: FileContent = {
        fileName: file.name,
        data,
        headers,
        fileType: isCSV ? "csv" : "excel",
        uploadTime: new Date().toISOString(),
        totalRows: data.length,
        totalColumns: headers.length,
      };

      setFileContent(fileContentData);

      // Start auto-fill process
      setIsAutoFilling(true);

      // auto fill form
      const response = await api.post(
        "/agent/post_market_surveillance/analyze?type=EXCEL_FILLOUT",
        {
          file_info: fileContentData.data,
        }
      );

      const autoFilledData = response.data?.messages[0];

      // Auto-fill form with extracted data
      if (autoFilledData) {
        setFormData((prevData) => ({
          ...prevData,
          productType: autoFilledData.product_type || prevData.productType,
          productName: autoFilledData.product_name || prevData.productName,
          lotNumber: autoFilledData.lot_number || prevData.lotNumber,
          indication: autoFilledData.indication || prevData.indication,
          manufacturer: autoFilledData.manufacturer || prevData.manufacturer,
          eventDescription:
            autoFilledData.event_description || prevData.eventDescription,
          eventDate: autoFilledData.date_of_event || prevData.eventDate,
          eventOutcome: autoFilledData.event_outcome || prevData.eventOutcome,
          severityClassification:
            autoFilledData.severity_classification ||
            prevData.severityClassification,
          reporterType: autoFilledData.reporter_type || prevData.reporterType,
          reporterLocation:
            autoFilledData.reporter_location || prevData.reporterLocation,
          manufacturerResponse:
            autoFilledData.manufacturer_response ||
            prevData.manufacturerResponse,
          capaRequired:
            autoFilledData.is_capa !== undefined
              ? autoFilledData.is_capa
              : prevData.capaRequired,
        }));

        toast.success(
          "Form auto-filled with extracted data from uploaded file!"
        );
      }

      // End auto-fill process
      setIsAutoFilling(false);

      console.log("Auto-filled data:", autoFilledData);
      console.log("File content extracted:", {
        fileName: fileContentData.fileName,
        totalRows: fileContentData.totalRows,
        totalColumns: fileContentData.totalColumns,
        headers: fileContentData.headers,
        fileType: fileContentData.fileType,
        uploadTime: fileContentData.uploadTime,
        sampleData: data.slice(0, 3), // First 3 rows for preview
      });

      setTimeout(() => setIsUploading(false), 1000);
    } catch (error) {
      console.error("Error reading file:", error);
      setIsUploading(false);
      setIsAutoFilling(false);
      setUploadedFile(null);
      toast.error(
        `Error processing file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const getReportStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-600",
      submitted: "bg-blue-100 text-blue-600",
      approved: "bg-green-100 text-green-600",
      rejected: "bg-red-100 text-red-600",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-600";
  };

  const features = [
    "Automated Report Generation",
    "Regulatory Compliance",
    "Deadline Tracking",
    "CAPA (Corrective and Preventive Action) Integration",
  ];
  const productTypes = [
    "drug",
    "biologic",
    "medical_device",
    "combination_product",
  ];
  const outcomes = [
    "Death",
    "Life-Threatening",
    "Hospitalization",
    "Disability",
    "Congenital Anomaly",
    "Other Serious",
    "Non-Serious",
    "Recovered",
    "Unknown",
  ];
  const severities = ["Serious", "Non-serious", "Death", "Life-Threatening"];
  const reporterTypes = [
    "Healthcare Professional",
    "Patient",
    "Manufacturer Personnel",
    "Other",
  ];
  const locations = [
    "United States",
    "Canada",
    "European Union",
    "Japan",
    "Other",
  ];

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
      <div className="flex flex-col">
        <div className="relative w-full py-16 px-4 md:py-24">
          <div className="w-full max-w-[1400px] px-[20px] mx-auto">
            <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 rounded-2xl p-8 md:p-12 overflow-hidden">
              <div className="absolute right-12 md:right-16 lg:right-24 top-1/2 transform -translate-y-1/2 opacity-20">
                <svg
                  width="140"
                  height="160"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="relative z-10 max-w-4xl w-full">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
                  Automate Post-Market Surveillance with AI
                </h1>
                <p className="text-xl md:text-2xl text-white mb-10 leading-relaxed max-w-3xl">
                  Generate FDA-compliant adverse event reports, track regulatory
                  submissions, and ensure compliance with MDR, FAERS, and PSUR
                  requirements. Streamline your post-market surveillance
                  workflow.
                </p>

                <div className="flex flex-wrap gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-white font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full py-4 md:py-6 -mt-12 md:-mt-16">
          {/* Metric Cards */}
          <div className="w-full max-w-[1400px] px-[20px] mx-auto mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Due Today Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                  <div className="absolute inset-0 bg-red-50 rounded-full"></div>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Due Today
                      </h3>
                      <p className="text-sm text-gray-500">
                        Reports requiring immediate attention
                      </p>
                    </div>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-red-600">
                      {metrics.dueToday}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">reports</span>
                  </div>
                </div>
              </div>

              {/* Due This Week Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                  <div className="absolute inset-0 bg-yellow-50 rounded-full"></div>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-yellow-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Due This Week
                      </h3>
                      <p className="text-sm text-gray-500">
                        Upcoming report deadlines
                      </p>
                    </div>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-yellow-600">
                      {metrics.dueThisWeek}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">reports</span>
                  </div>
                </div>
              </div>

              {/* Open CAPA Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                  <div className="absolute inset-0 bg-blue-50 rounded-full"></div>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Open Corrective and Preventive Action
                      </h3>
                      <p className="text-sm text-gray-500">
                        Active corrective actions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-blue-600">
                      {metrics.openCapa}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">reports</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[1400px] px-[20px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                {generatedData && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-green-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Report Generated Successfully!
                        </h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>
                            Your {generatedData.predicted_report} report has
                            been generated
                            {capaData
                              ? " along with Corrective and Preventive Action analysis"
                              : ""}
                            . Check the "Generated Reports" section to download
                            or view the {capaData ? "reports" : "report"}.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      Adverse Event Assessment
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      Answer a few questions to get your personalized
                      post-market surveillance pathway
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 mb-8">
                  <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      {isUploading ? (
                        <svg
                          className="w-6 h-6 text-gray-600 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      )}
                    </div>
                    {uploadedFile ? (
                      <div className="mb-4">
                        <p className="text-green-600 font-medium mb-2">
                          ✓ {uploadedFile.name} uploaded successfully
                        </p>
                        {fileContent && (
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              📊 {fileContent.totalRows} rows,{" "}
                              {fileContent.totalColumns} columns
                            </p>
                            <p>
                              📋 Headers:{" "}
                              {fileContent.headers.slice(0, 3).join(", ")}
                              {fileContent.headers.length > 3 &&
                                ` (+${fileContent.headers.length - 3} more)`}
                            </p>
                            <p className="text-purple-600">
                              Processing with AI model...
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-600 mb-4">
                        Upload structured AE logs (CSV/Excel){" "}
                        <span className="text-red-500">*</span>
                      </p>
                    )}
                    <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg inline-flex items-center gap-2 mx-auto transition-colors cursor-pointer">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      {isUploading ? "Processing..." : "Upload CSV/Excel"}
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>

                {fileContent && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Data Preview - {fileContent.fileName}
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs">
                        <thead>
                          <tr className="bg-blue-100">
                            {fileContent.headers
                              .slice(0, 6)
                              .map((header, index) => (
                                <th
                                  key={index}
                                  className="px-2 py-1 text-left text-blue-900 font-medium"
                                >
                                  {header || `Column ${index + 1}`}
                                </th>
                              ))}
                            {fileContent.headers.length > 6 && (
                              <th className="px-2 py-1 text-left text-blue-900 font-medium">
                                +{fileContent.headers.length - 6} more
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {fileContent.data.slice(1, 4).map((row, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className="border-b border-blue-200"
                            >
                              {row.slice(0, 6).map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="px-2 py-1 text-gray-700"
                                >
                                  {String(cell).length > 20
                                    ? `${String(cell).substring(0, 20)}...`
                                    : String(cell)}
                                </td>
                              ))}
                              {row.length > 6 && (
                                <td className="px-2 py-1 text-gray-500">...</td>
                              )}
                            </tr>
                          ))}
                          {fileContent.totalRows > 4 && (
                            <tr>
                              <td
                                colSpan={Math.min(
                                  6,
                                  fileContent.headers.length
                                )}
                                className="px-2 py-1 text-center text-gray-500 italic"
                              >
                                ... and {fileContent.totalRows - 4} more rows
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-3 text-xs text-blue-700 bg-blue-100 rounded p-2">
                      💡 The AI will analyze this data to auto-populate adverse
                      event details below
                    </div>
                  </div>
                )}

                {/* <div className="relative mb-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div> */}

                {isAutoFilling ? (
                  // Auto-fill loading state
                  <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center py-16 px-8">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                        <svg
                          className="w-8 h-8 text-purple-600 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        AI is analyzing your data...
                      </h3>
                      <p className="text-gray-600 text-center max-w-md">
                        Our AI is extracting adverse event information from your
                        uploaded file and auto-filling the form. This may take a
                        few moments.
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-sm text-purple-600">
                        <svg
                          className="w-4 h-4 animate-pulse"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Processing uploaded file data
                      </div>
                    </div>
                  </div>
                ) : (
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Product Details
                      </h3>
                      <FormField label="Product Type" required>
                        <FormSelect
                          name="productType"
                          value={formData.productType}
                          onChange={handleInputChange}
                        >
                          <option value="">Select product type</option>
                          {productTypes.map((type) => (
                            <option key={type} value={type}>
                              {type
                                .replace("-", " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </option>
                          ))}
                        </FormSelect>
                      </FormField>
                      <FormField label="Product Name" required>
                        <FormInput
                          name="productName"
                          value={formData.productName}
                          onChange={handleInputChange}
                          placeholder="Enter product name"
                        />
                      </FormField>
                      <FormField label="Lot Number" required>
                        <FormInput
                          name="lotNumber"
                          value={formData.lotNumber}
                          onChange={handleInputChange}
                          placeholder="Enter lot number"
                        />
                      </FormField>
                      <FormField label="Indication" required>
                        <FormInput
                          name="indication"
                          value={formData.indication}
                          onChange={handleInputChange}
                          placeholder="Product indication"
                        />
                      </FormField>
                      <FormField label="Manufacturer">
                        <FormInput
                          name="manufacturer"
                          value={formData.manufacturer}
                          onChange={handleInputChange}
                          placeholder="Enter manufacturer name"
                        />
                      </FormField>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Event Description
                      </h3>
                      <FormField label="Event Description" required>
                        <FormTextarea
                          name="eventDescription"
                          value={formData.eventDescription}
                          onChange={handleInputChange}
                          placeholder="Describe the adverse event in detail"
                        />
                      </FormField>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Event Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField label="Date of Event" required>
                          <div className="relative">
                            <FormInput
                              type="date"
                              name="eventDate"
                              value={formData.eventDate}
                              onChange={handleInputChange}
                              placeholder="mm/dd/yyyy"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          </div>
                        </FormField>
                        <FormField label="Event Outcome" required>
                          <FormSelect
                            name="eventOutcome"
                            value={formData.eventOutcome}
                            onChange={handleInputChange}
                          >
                            <option value="" disabled>
                              Select outcome
                            </option>
                            {outcomes.map((outcome) => (
                              <option key={outcome} value={outcome}>
                                {outcome}
                              </option>
                            ))}
                          </FormSelect>
                        </FormField>
                        <FormField label="Severity Classification">
                          <FormSelect
                            name="severityClassification"
                            value={formData.severityClassification}
                            onChange={handleInputChange}
                          >
                            <option value="" disabled>
                              Select severity
                            </option>
                            {severities.map((severity) => (
                              <option key={severity} value={severity}>
                                {severity}
                              </option>
                            ))}
                          </FormSelect>
                        </FormField>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Reporter Type">
                          <div className="space-y-2">
                            {reporterTypes.map((type, index) => (
                              <label
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="radio"
                                  name="reporterType"
                                  value={type.toLowerCase().replace(" ", "-")}
                                  checked={
                                    formData.reporterType ===
                                    type.toLowerCase().replace(" ", "-")
                                  }
                                  onChange={handleInputChange}
                                  className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-700">
                                  {type}
                                </span>
                              </label>
                            ))}
                          </div>
                        </FormField>
                        <FormField label="Reporter Location" required>
                          <FormSelect
                            name="reporterLocation"
                            value={formData.reporterLocation}
                            onChange={handleInputChange}
                          >
                            <option value="" disabled>
                              Select location
                            </option>
                            {locations.map((location) => (
                              <option key={location} value={location}>
                                {location}
                              </option>
                            ))}
                          </FormSelect>
                        </FormField>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <FormField label="Manufacturer Response (Optional)">
                        <FormTextarea
                          name="manufacturerResponse"
                          value={formData.manufacturerResponse}
                          onChange={handleInputChange}
                          placeholder="Internal assessment summary or manufacturer response"
                        />
                      </FormField>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="capa-required"
                          name="capaRequired"
                          checked={formData.capaRequired}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label
                          htmlFor="capa-required"
                          className="text-sm text-gray-700"
                        >
                          This event requires CAPA (Corrective and Preventive
                          Action)
                        </label>
                      </div>
                    </div>

                    {!isFormValid() && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-yellow-800">
                              Please fill in all required fields
                            </p>
                            {getMissingFields().length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-yellow-700 mb-1">
                                  Missing required fields:
                                </p>
                                <ul className="text-xs text-yellow-700 list-disc list-inside space-y-1">
                                  {getMissingFields().map((field, index) => (
                                    <li key={index}>{field.label}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <p className="text-xs text-yellow-700 mt-2">
                              All fields marked with an asterisk (*) are
                              required to generate the report.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Progress Steps Display */}
                    {isSubmitting && progressSteps.length > 0 && (
                      <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-purple-800 mb-3">
                          Processing Your Report
                        </h3>
                        <div className="space-y-2">
                          {progressSteps.map((step, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-5 h-5 flex items-center justify-center">
                                {step.startsWith('✓') ? (
                                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                ) : step.startsWith('✗') ? (
                                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <div className="w-3 h-3 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                                )}
                              </div>
                              <span className={`text-sm ${
                                step.startsWith('✓') ? 'text-green-700' : 
                                step.startsWith('✗') ? 'text-red-700' : 
                                'text-purple-700'
                              }`}>
                                {step.replace(/^[✓✗]\s*/, '')}
                              </span>
                            </div>
                          ))}
                          {progressStep && !progressSteps.some(step => step.includes(progressStep.replace('...', ''))) && (
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 flex items-center justify-center">
                                <div className="w-3 h-3 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                              </div>
                              <span className="text-sm text-purple-700">{progressStep}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting || !isFormValid()}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="w-5 h-5 animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            {progressStep || "Generating Report..."}
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            Generate Report
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="space-y-6">
                <Card
                  title="Predicted Report Type"
                  id="predicted-report-section"
                >
                  <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-4 mb-3">
                    <div className="text-2xl font-bold text-purple-700 text-center">
                      {generatedData?.predicted_report || "N/A"}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center mb-4">
                    {generatedData?.description || "No description available"}
                  </p>
                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Due Date:
                    </span>
                    <span className="text-gray-500">
                      {generatedData?.due_date}
                    </span>
                  </div>
                </Card>

                <Card title="Generated Reports">
                  {generatedData ? (
                    <div className="space-y-4">
                      {/* AI Generated Report */}
                      <div className="border-2 border-purple-200 bg-purple-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-semibold text-purple-900">
                                {formData.productName} -{" "}
                                {generatedData.predicted_report ||
                                  "AI Generated Report"}
                              </span>
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                                Generated
                              </span>
                            </div>
                            <div className="text-xs text-purple-700 mb-3">
                              AI Report • {new Date().toLocaleDateString()}
                            </div>
                            <div className="bg-white border border-gray-300 rounded p-4 max-h-60 overflow-y-auto">
                              <div className="leading-relaxed text-gray-700 space-y-4">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm, supersub]}
                                  children={generatedData.generated_report || "No report content available"}
                                  components={components}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => downloadReportAsPDF(generatedData)}
                            className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            Download PDF
                          </button>
                          <button
                            onClick={() =>
                              copyToClipboard(generatedData.generated_report)
                            }
                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            Copy
                          </button>
                          <button
                            onClick={startNewReport}
                            className="flex items-center gap-2 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 text-sm rounded-lg transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            New Report
                          </button>
                        </div>
                      </div>

                      {/* CAPA Report */}
                      {capaData && (
                        <div className="border-2 border-purple-200 bg-purple-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-semibold text-orange-900">
                                  Corrective and Preventive Action Report -{" "}
                                  {formData.productName}
                                </span>
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                                  Generated
                                </span>
                              </div>
                              <div className="text-xs text-orange-700 mb-3">
                                Corrective and Preventive Action Analysis •{" "}
                                {new Date().toLocaleDateString()}
                                {capaData.due_date &&
                                  ` • Due: ${capaData.due_date}`}
                              </div>
                              <div className="bg-white border border-gray-300 rounded p-4 max-h-60 overflow-y-auto">
                                <div className="leading-relaxed text-gray-700 space-y-4">
                                  <ReactMarkdown
                                    remarkPlugins={[remarkGfm, supersub]}
                                    children={capaData.generated_report || "No Corrective and Preventive Action content available"}
                                    components={components}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                downloadReportAsPDF(capaData, "capa")
                              }
                              className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              Download CAPA Report
                            </button>
                            <button
                              onClick={() =>
                                copyToClipboard(capaData.generated_report)
                              }
                              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                              Copy CAPA
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Existing Reports */}
                      {generatedReports.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-600">
                            Previous Reports
                          </h4>
                          {generatedReports.slice(0, 2).map((report) => (
                            <div
                              key={report.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium text-gray-900">
                                    {report.fileName}
                                  </span>
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full ${getReportStatusColor(
                                      report.status
                                    )}`}
                                  >
                                    {report.status}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {report.type} •{" "}
                                  {new Date(
                                    report.createdAt
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                              {report.downloadUrl && (
                                <button className="text-purple-600 hover:text-purple-700">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                          {generatedReports.length > 2 && (
                            <div className="text-center pt-2">
                              <button className="text-sm text-purple-600 hover:text-purple-700">
                                View all {generatedReports.length} reports
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : generatedReports.length > 0 ? (
                    <div className="space-y-3">
                      {generatedReports.slice(0, 3).map((report) => (
                        <div
                          key={report.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                {report.fileName}
                              </span>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${getReportStatusColor(
                                  report.status
                                )}`}
                              >
                                {report.status}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {report.type} •{" "}
                              {new Date(report.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          {report.downloadUrl && (
                            <button className="text-purple-600 hover:text-purple-700">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      {generatedReports.length > 3 && (
                        <div className="text-center pt-2">
                          <button className="text-sm text-purple-600 hover:text-purple-700">
                            View all {generatedReports.length} reports
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-gray-400 mb-2">
                        <svg
                          className="w-12 h-12 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 mb-2">
                        No reports generated yet
                      </p>
                      <p className="text-sm text-gray-400">
                        Fill out the form to generate your first report
                      </p>
                    </div>
                  )}
                </Card>

                <Card title="Recent Reports">
                  {isLoadingReports ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 mx-auto mb-4 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                      <p className="text-gray-600">Loading recent reports...</p>
                    </div>
                  ) : recentReports.length > 0 ? (
                    <div className="space-y-3">
                      {(showAllReports
                        ? recentReports
                        : recentReports.slice(0, 5)
                      ).map((report) => (
                        <div
                          key={report.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-sm font-medium text-gray-900">
                                {report.product_name}
                              </div>
                              <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-600">
                                {report.is_capa
                                  ? "Corrective and Preventive Action"
                                  : report.content?.predicted_report ||
                                    "Adverse Report"}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 space-y-1">
                              <div>
                                {new Date(
                                  report.timestamp
                                ).toLocaleDateString()}{" "}
                                • {report.event_outcome}
                              </div>
                              <div className="text-gray-400">
                                Lot: {report.lot_number} •{" "}
                                {report.reporter_location}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => downloadHistoricalReport(report)}
                              className="text-purple-600 hover:text-purple-700 p-1 rounded transition-colors"
                              title="Download PDF"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  report.content?.generated_report || ""
                                )
                              }
                              className="text-gray-600 hover:text-gray-700 p-1 rounded transition-colors"
                              title="Copy content"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                      {recentReports.length > 5 && (
                        <div className="text-center pt-2">
                          <button
                            onClick={() => setShowAllReports(!showAllReports)}
                            className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
                          >
                            {showAllReports
                              ? "Show less"
                              : `View all ${recentReports.length} reports`}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-400 mb-2">No recent reports</p>
                      <p className="text-sm text-gray-500">
                        Generate your first report using the form
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostMarketSurveillanceAgent;
