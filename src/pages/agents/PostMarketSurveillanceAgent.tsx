import api from "../../api";
import AnimatedBackground from "../../components/AnimatedBackground";
import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../../components/Toast";
import { useAuth } from "../../provider/authProvider";

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

const PostMarketSurveillanceAgent = ({
  generatedReports = [],
}: Pick<PostMarketSurveillanceAgentProps, "generatedReports">) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [capaData, setCapaData] = useState<any>(null);

  // Toast notifications
  const toast = useToast();
  const { user } = useAuth();

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

  // Function to download report as PDF
  const downloadReportAsPDF = async (
    reportData: any,
    reportType: "adverse" | "capa" = "adverse"
  ) => {
    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      // Set up PDF styling
      doc.setFontSize(20);
      const title =
        reportType === "capa" ? "CAPA REPORT" : "ADVERSE EVENT REPORT";
      doc.text(title, 20, 30);

      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);

      let yPosition = 60;
      const lineHeight = 8;
      const maxWidth = 170;

      if (reportType === "capa") {
        // CAPA Report Format
        doc.setFontSize(14);
        doc.text("CAPA Report", 20, yPosition);
        yPosition += lineHeight * 2;

        doc.setFontSize(10);
        const capaContent =
          reportData.generated_report || "No CAPA content available";
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
        if (reportData.due_date) {
          yPosition += lineHeight;
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.setFontSize(12);
          doc.text(`Due Date: ${reportData.due_date}`, 20, yPosition);
        }

        // Footer
        yPosition += lineHeight * 2;
        doc.setFontSize(8);
        doc.text(`Generated at: ${new Date().toLocaleString()}`, 20, yPosition);

        // Save the PDF
        const fileName = `CAPA_Report_${
          new Date().toISOString().split("T")[0]
        }.pdf`;
        doc.save(fileName);
      } else {
        // Existing Adverse Event Report Format
        // Report Type
        doc.setFontSize(14);
        doc.text("Report Type:", 20, yPosition);
        doc.setFontSize(12);
        doc.text(reportData.predicted_report || "N/A", 70, yPosition);
        yPosition += lineHeight * 2;

        // Product Information
        doc.setFontSize(14);
        doc.text("Product Information:", 20, yPosition);
        yPosition += lineHeight;

        doc.setFontSize(10);
        const productInfo = [
          `Product Type: ${formData.productType}`,
          `Product Name: ${formData.productName}`,
          `Lot Number: ${formData.lotNumber}`,
          `Indication: ${formData.indication}`,
          `Manufacturer: ${formData.manufacturer}`,
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
          `Date of Event: ${formData.eventDate}`,
          `Event Outcome: ${formData.eventOutcome}`,
          `Severity: ${formData.severityClassification}`,
          `Reporter Type: ${formData.reporterType}`,
          `Reporter Location: ${formData.reporterLocation}`,
        ];

        eventInfo.forEach((info) => {
          doc.text(info, 25, yPosition);
          yPosition += lineHeight;
        });
        yPosition += lineHeight;

        // Event Description
        if (formData.eventDescription) {
          doc.setFontSize(14);
          doc.text("Event Description:", 20, yPosition);
          yPosition += lineHeight;

          doc.setFontSize(10);
          const descriptionLines = doc.splitTextToSize(
            formData.eventDescription,
            maxWidth
          );
          descriptionLines.forEach((line: string) => {
            if (yPosition > 270) {
              // Check if we need a new page
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
          reportData.generated_report || "No analysis available",
          maxWidth
        );
        analysisLines.forEach((line: string) => {
          if (yPosition > 270) {
            // Check if we need a new page
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, 25, yPosition);
          yPosition += lineHeight;
        });

        // Manufacturer Response
        if (formData.manufacturerResponse) {
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
            formData.manufacturerResponse,
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

        // CAPA Status
        yPosition += lineHeight;
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(10);
        doc.text(
          `CAPA Required: ${formData.capaRequired ? "Yes" : "No"}`,
          20,
          yPosition
        );

        // Footer
        yPosition += lineHeight * 2;
        doc.setFontSize(8);
        doc.text(`Generated at: ${new Date().toLocaleString()}`, 20, yPosition);

        // Save the PDF
        const fileName = `${
          reportData.predicted_report || "Adverse_Event_Report"
        }_${new Date().toISOString().split("T")[0]}.pdf`;
        doc.save(fileName);
      }

      toast.success("PDF report downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(
        "Failed to generate PDF. Downloading as text file instead...",
        6000
      );

      // Fallback to text download
      const reportContent =
        reportType === "capa"
          ? `
CAPA REPORT
${new Date().toLocaleDateString()}

CAPA Analysis:
${reportData.generated_report || "No CAPA content available"}

Due Date: ${reportData.due_date || "Not specified"}

Generated at: ${new Date().toLocaleString()}
      `.trim()
          : `
ADVERSE EVENT REPORT
${new Date().toLocaleDateString()}

Report Type: ${reportData.predicted_report || "N/A"}

Product Information:
- Product Type: ${formData.productType}
- Product Name: ${formData.productName}
- Lot Number: ${formData.lotNumber}
- Indication: ${formData.indication}
- Manufacturer: ${formData.manufacturer}

Event Details:
- Date of Event: ${formData.eventDate}
- Event Outcome: ${formData.eventOutcome}
- Severity: ${formData.severityClassification}
- Reporter Type: ${formData.reporterType}
- Reporter Location: ${formData.reporterLocation}
- Event Description: ${formData.eventDescription}

AI Generated Analysis:
${reportData.generated_report || "No analysis available"}

${
  formData.manufacturerResponse
    ? `Manufacturer Response:\n${formData.manufacturerResponse}`
    : ""
}

${formData.capaRequired ? "CAPA Required: Yes" : "CAPA Required: No"}

Generated at: ${new Date().toLocaleString()}
      `.trim();

      const blob = new Blob([reportContent], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const filename =
        reportType === "capa"
          ? `CAPA_Report_${new Date().toISOString().split("T")[0]}.txt`
          : `${reportData.predicted_report || "Adverse_Event_Report"}_${
              new Date().toISOString().split("T")[0]
            }.txt`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
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

    try {
      // Validate required fields
      const requiredFields = [
        "productType",
        "productName",
        "lotNumber",
        "indication",
        "eventDescription",
        "eventDate",
        "eventOutcome",
        "reporterType",
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
        return;
      }

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

      const response = await api.post(
        `/agent/post_market_surveillance/analyze?type=ADVERSE_REPORT`,
        { ...submissionData, is_capa: false }
      );

      setGeneratedData(response.data?.messages[0]);

      if (formData.capaRequired) {
        const capResponse = await api.post(
          `/agent/post_market_surveillance/analyze?type=CAPA_GENERATION`,
          submissionData
        );
        debugger;
        setCapaData(capResponse.data?.messages[0]);
      }

      console.log("Submitting adverse event report:", submissionData);

      // Success handling
      const successMessage = formData.capaRequired
        ? "Adverse event report and CAPA analysis generated successfully!"
        : "Adverse event report generated successfully!";
      toast.success(successMessage);

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
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Error generating report. Please try again.");
    } finally {
      setIsSubmitting(false);
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
    "CAPA Integration",
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

        <div className="w-full py-4 md:py-6">
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
                            {capaData ? " along with CAPA analysis" : ""}. Check
                            the "Generated Reports" section to download or view
                            the {capaData ? "reports" : "report"}.
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
                        Upload structured AE logs (CSV/Excel)
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
                        <FormField label="Reporter Type" required>
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

                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
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
                            Generating Report...
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
                            <div className="text-sm text-gray-700 bg-white rounded p-3 border">
                              <p className="leading-relaxed">
                                {generatedData.generated_report ||
                                  "No report content available"}
                              </p>
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
                        <div className="border-2 border-orange-200 bg-orange-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-semibold text-orange-900">
                                  CAPA Report - {formData.productName}
                                </span>
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                                  Generated
                                </span>
                              </div>
                              <div className="text-xs text-orange-700 mb-3">
                                CAPA Analysis •{" "}
                                {new Date().toLocaleDateString()}
                                {capaData.due_date &&
                                  ` • Due: ${capaData.due_date}`}
                              </div>
                              <div className="text-sm text-gray-700 bg-white rounded p-3 border max-h-40 overflow-y-auto">
                                <p className="leading-relaxed">
                                  {capaData.generated_report?.length > 300
                                    ? `${capaData.generated_report.substring(
                                        0,
                                        300
                                      )}...`
                                    : capaData.generated_report ||
                                      "No CAPA content available"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                downloadReportAsPDF(capaData, "capa")
                              }
                              className="flex items-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg transition-colors"
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
                              Download CAPA PDF
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
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 002 2v8a2 2 0 002 2z"
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
                  {generatedReports.length > 0 ? (
                    <div className="space-y-2">
                      {generatedReports.slice(0, 2).map((report) => (
                        <div
                          key={report.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {report.fileName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getReportStatusColor(
                              report.status
                            )}`}
                          >
                            {report.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No recent reports</p>
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
