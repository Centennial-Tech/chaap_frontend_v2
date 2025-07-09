import React, { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import Progress from "./ui/Progress";
import Modal from "./ui/Modal";
import { Edit, Download, Trash2 } from "lucide-react";
import { deleteSubmission } from "../helpers/submissionApiHelper";
import type { Submission } from "../helpers/submissionApiHelper";
import { useOverlay } from "../provider/overleyProvider";

interface SubmissionTableProps {
  submissions: Submission[];
  onDelete: (id: string) => Promise<void>; // Changed from number to string
  setConfirmDeleteOpen: (open: boolean) => void;
  setConfirmDeleteId: (id: string) => void;
}

const SubmissionTable: React.FC<SubmissionTableProps> = ({
  submissions,
  onDelete,
  setConfirmDeleteOpen,
  setConfirmDeleteId,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { showOverlay, hideOverlay } = useOverlay();

  useEffect(() => {
    if (setConfirmDeleteOpen) {
      showOverlay();
    } else {
      hideOverlay();
    }
  }, [setConfirmDeleteOpen, showOverlay, hideOverlay]);

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!setConfirmDeleteId) return;
    console.log("SubmissionTable: handleConfirmDelete called with ID:", setConfirmDeleteId);
    setIsDeleting(true);
    try {
      // Use the delete API helper
      await deleteSubmission(setConfirmDeleteId);
      // Call the parent's onDelete callback to refresh the list
      await onDelete(setConfirmDeleteId);
      console.log("SubmissionTable: Delete confirmation completed");
    } catch (error) {
      console.error("Error deleting submission:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsDeleting(false);
      setConfirmDeleteId(null);
      setConfirmDeleteOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
    setConfirmDeleteOpen(false);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString; // Fallback to original string if parsing fails
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <div className="px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
            <span className="text-blue-700 font-medium text-xs leading-none uppercase tracking-wide">
              Draft
            </span>
          </div>
        );
      case "in_progress":
        return (
          <div className="px-3 py-1 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center">
            <span className="text-orange-700 font-medium text-xs leading-none uppercase tracking-wide">
              In Progress
            </span>
          </div>
        );
      case "completed":
        return (
          <div className="px-3 py-1 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center">
            <span className="text-green-700 font-medium text-xs leading-none uppercase tracking-wide">
              Completed
            </span>
          </div>
        );
      default:
        return (
          <div className="px-3 py-1 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
            <span className="text-gray-700 font-medium text-xs leading-none uppercase tracking-wide">
              {status}
            </span>
          </div>
        );
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full transition-all duration-500 ease-in-out">
          <thead className="bg-ms-gray-100">
            <tr className="transition-colors duration-300 ease-in-out">
              <th className="px-6 py-3 text-left text-xs font-medium text-ms-gray-700 uppercase tracking-wider transition-colors duration-300 ease-in-out">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ms-gray-700 uppercase tracking-wider">
                Submission Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ms-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ms-gray-700 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ms-gray-700 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ms-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-ms-gray-300">
            {submissions.map((submission) => (
              <tr key={submission.id || submission.submission_id} className="transition-colors duration-300 ease-in-out hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap transition-colors duration-300 ease-in-out">
                  <div className="text-sm font-medium text-ms-gray-700">
                    {submission.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-ms-gray-700">
                  {submission.submissionType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex justify-start">
                    {getStatusIcon(submission.status)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full">
                    <Progress value={submission.progress} className="h-2" />
                    <span className="text-xs text-ms-gray-700 mt-1 block">
                      {submission.progress}% Complete
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-ms-gray-700">
                  {formatDate(submission.updated_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="w-4 h-4 text-blue-600 hover:text-blue-700" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="w-4 h-4 text-green-600 hover:text-green-700" />
                  </Button>
                  {submission.status === "draft" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDeleteClick(submission.id || submission.submission_id)
                      }
                    >
                      <Trash2 className="w-4 h-4 text-red-600 hover:text-red-700" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No modal or overlay rendering here */}
    </>
  );
};

export default SubmissionTable;