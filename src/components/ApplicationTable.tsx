import React, { useState } from "react";
import { Button } from "./ui/Button";
import Progress from "./ui/Progress";
import { Edit, Download, Trash2 } from "lucide-react";
import { type Application } from "../helpers/applicationApiHelper";

interface ApplicationTableProps {
  applications: Application[];
  onDelete: (id: string) => Promise<void>;
  onDeleteClick: (id: string) => void;
  showConfirmDialog: string | null;
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  onDelete,
  onDeleteClick,
  showConfirmDialog
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
                    onClick={() => onDeleteClick(application.application_id)}
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

export default ApplicationTable;
