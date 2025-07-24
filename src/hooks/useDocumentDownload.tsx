import { useCallback } from 'react';
import { DownloadService } from '../utils/downloadService';
import type { DownloadOptions, ReportData } from '../utils/downloadService';
import { useToast } from './useToast';

/**
 * Custom hook for document downloads with error handling
 */
export const useDocumentDownload = () => {
  const { success, error } = useToast();

  /**
   * Download document in specified format
   */
  const downloadDocument = useCallback(async (options: DownloadOptions) => {
    try {
      await DownloadService.downloadDocument(options);
      success(`Document downloaded successfully as ${options.format.toUpperCase()}`);
    } catch (downloadError) {
      console.error('Download error:', downloadError);
      error(`Failed to download document. Please try again.`);
    }
  }, [success, error]);

  /**
   * Download PDF document
   */
  const downloadPDF = useCallback(async (content: string, filename?: string, reportType?: string, title?: string) => {
    await downloadDocument({
      format: "pdf",
      content,
      filename,
      reportType: reportType as any,
      title
    });
  }, [downloadDocument]);

  /**
   * Download Word document
   */
  const downloadDOC = useCallback(async (content: string, filename?: string, reportType?: string, title?: string) => {
    await downloadDocument({
      format: "doc",
      content,
      filename,
      reportType: reportType as any,
      title
    });
  }, [downloadDocument]);

  /**
   * Download plain text document
   */
  const downloadTXT = useCallback(async (content: string, filename?: string, reportType?: string, title?: string) => {
    await downloadDocument({
      format: "txt",
      content,
      filename,
      reportType: reportType as any,
      title
    });
  }, [downloadDocument]);

  return {
    downloadDocument,
    downloadPDF,
    downloadDOC,
    downloadTXT
  };
}; 