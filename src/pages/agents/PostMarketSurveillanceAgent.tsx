import AnimatedBackground from "../../components/AnimatedBackground";
import { useState } from "react";

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
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

const PostMarketSurveillanceAgent = ({
  predictedReportType,
  generatedReports = [],
}: PostMarketSurveillanceAgentProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileContent, setFileContent] = useState<FileContent | null>(null);

  const defaultPredictedReportType: PredictedReportType = {
    type: "MDR",
    dueDate: "Not calculated",
    description: "Based on your product type and event details",
  };

  const currentPredictedReportType =
    predictedReportType || defaultPredictedReportType;

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
      setUploadedFile(null);
      alert(
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
    "medical-device",
    "combination-product",
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
                        Upload structured AE logs (CSV/Excel) or fill form
                        manually
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

                <div className="relative mb-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                <form className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Product Details
                    </h3>
                    <FormField label="Product Type" required>
                      <FormSelect>
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
                      <FormInput placeholder="Enter product name" />
                    </FormField>
                    <FormField label="Lot Number" required>
                      <FormInput placeholder="Enter lot number" />
                    </FormField>
                    <FormField label="Indication" required>
                      <FormInput placeholder="Product indication" />
                    </FormField>
                    <FormField label="Manufacturer">
                      <FormInput placeholder="Enter manufacturer name" />
                    </FormField>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Event Description
                    </h3>
                    <FormField label="Event Description" required>
                      <FormTextarea placeholder="Describe the adverse event in detail" />
                    </FormField>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Event Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField label="Date of Event" required>
                        <div className="relative">
                          <FormInput placeholder="mm/dd/yyyy" />
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
                        <FormSelect>
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
                        <FormSelect>
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
                        <FormSelect>
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
                      <FormTextarea placeholder="Internal assessment summary or manufacturer response" />
                    </FormField>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="capa-required"
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
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
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
                    </button>
                  </div>
                </form>
              </div>

              <div className="space-y-6">
                <Card title="Predicted Report Type">
                  <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-4 mb-3">
                    <div className="text-2xl font-bold text-purple-700 text-center">
                      {currentPredictedReportType.type}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center mb-4">
                    {currentPredictedReportType.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Due Date:
                    </span>
                    <span className="text-gray-500">
                      {currentPredictedReportType.dueDate}
                    </span>
                  </div>
                </Card>

                <Card title="Generated Reports">
                  {generatedReports.length > 0 ? (
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
