import pdfToText from "react-pdftotext";
import mammoth from "mammoth";

export const extractText = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop()?.toLowerCase();

  try {
    if (ext === "txt") {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          console.log("Extracted text from txt file:", content);
          resolve(content || "");
        };
        reader.onerror = () => reject(new Error("Failed to read text file"));
        reader.readAsText(file);
      });
    } else if (ext === "docx") {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const arrayBuffer = event.target?.result as ArrayBuffer;
            const result = await mammoth.extractRawText({ arrayBuffer });
            console.log("Extracted text from DOCX file:", result.value);
            resolve(result.value || "");
          } catch (error) {
            console.error("Failed to extract text from doc/docx file:", error);
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error("Failed to read DOCX file"));
        reader.readAsArrayBuffer(file);
      });
    } else if (ext === "pdf") {
      try {
        const text = await pdfToText(file);
        console.log("Extracted text from PDF file:", text);
        return text;
      } catch (error) {
        console.error("Failed to extract text from pdf", error);
        throw new Error("Failed to extract text from PDF file");
      }
    } else {
      throw new Error(
        `Unsupported file type: ${ext}. Supported formats: PDF, DOCX, TXT`
      );
    }
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
};
