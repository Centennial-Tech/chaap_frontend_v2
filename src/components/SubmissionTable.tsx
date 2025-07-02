import React from "react";
import { Button } from "./ui/Button";
import { Link } from "react-router-dom";
import Progress from "./ui/Progress";
import { Edit, Download, Trash2 } from "lucide-react";

interface Submission {
  id: number;
  project: string;
  type: "Device" | "Drug";
  submissionType: string;
  targetSubmission: string;
  status: "draft" | "pending" | "approved";
  progress: number;
  updatedAt: string;
}

interface SubmissionTableProps {
  submissions: Submission[];
  onDelete: (id: number) => void;
  getStatusConfig: (status: string) => { text: string; color: string };
}

const SubmissionTable: React.FC<SubmissionTableProps> = ({
  submissions,
  onDelete,
  getStatusConfig,
}) => {
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
      case "pending":
        return (
          <div className="px-3 py-1 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center">
            <span className="text-orange-700 font-medium text-xs leading-none uppercase tracking-wide">
              Pending
            </span>
          </div>
        );
      case "approved":
        return (
          <div className="px-3 py-1 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center">
            <span className="text-green-700 font-medium text-xs leading-none uppercase tracking-wide">
              Approved
            </span>
          </div>
        );
      }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-ms-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-ms-gray-700 uppercase tracking-wider">
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
            <tr key={submission.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-ms-gray-900">
                  {submission.project}
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
                {new Date(submission.updatedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <Button variant="ghost" size="icon">
                  <Edit className="w-4 h-4 text-ms-gray-700" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download className="w-4 h-4 text-ms-gray-700" />
                </Button>
                {submission.status === "draft" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(submission.id)}
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
  );
};

export default SubmissionTable;
