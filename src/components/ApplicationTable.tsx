import React, { useState } from "react";
import { Button } from "./ui/Button";
import Progress from "./ui/Progress";
import { Edit, Download, Trash2 } from "lucide-react";
import { type Application } from "../helpers/applicationApiHelper";

interface ApplicationTableProps {
  applications: Application[];
  onDelete: (id: string) => Promise<void>; // Changed from number to string
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  onDelete,
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setShowConfirmDialog(id);
  };

  const handleConfirmDelete = async (id: string) => {
    console.log("ApplicationTable: handleConfirmDelete called with ID:", id);
    setShowConfirmDialog(null);
    // Call the onDelete function (which now does nothing)
    await onDelete(id);
    console.log("ApplicationTable: Delete confirmation completed");
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(null);
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
        <table className="w-full">
          <thead className="bg-ms-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-ms-gray-700 uppercase tracking-wider">
                Name
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
            {applications.map((application: any) => (
              <tr key={application.application_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-ms-gray-700">
                    {application.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex justify-start">
                    {getStatusIcon(application.status)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full">
                    <Progress value={application.progress} className="h-2" />
                    <span className="text-xs text-ms-gray-700 mt-1 block">
                      {application.progress}% Complete
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-ms-gray-700">
                  {application.updated_at}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="w-4 h-4 text-ms-gray-700" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="w-4 h-4 text-ms-gray-700" />
                  </Button>
                  {application.status === "draft" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(application.application_id)}
                    >
                      <Trash2 className="w-4 h-4 ms-red" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this application? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => showConfirmDialog && handleConfirmDelete(showConfirmDialog)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationTable;
