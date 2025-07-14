import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import Progress from "./ui/Progress";
import { Alert, AlertDescription } from "./ui/Alert";
import {
  CheckCircle2,
  AlertCircle,
  Circle,
  CheckCircle,
  Info,
  ExternalLink,
} from "lucide-react";
// import type { ChecklistItem } from "../types/schema";

interface SubmissionChecklistProps {
  submissionId: number;
}

// Calculate progress based on completed items
const calculateProgress = (items: any[]): number => {
  if (!items || items.length === 0) return 0;
  const completedCount = items.filter(
    (item) => item.status === "completed"
  ).length;
  return Math.round((completedCount / items.length) * 100);
};

// Mock data for development
const mockChecklistItems: any[] = [
  {
    id: 1,
    section: "Device Description",
    description:
      "Comprehensive description of the device including principles of operation",
    status: "completed",
    aiNotes: "All required elements present, including clear diagrams",
  },
  {
    id: 2,
    section: "Predicate Comparison Table",
    description: "Side-by-side comparison with identified predicate device",
    status: "review_needed",
    aiNotes: "Missing comparison of technological characteristics",
  },
  {
    id: 3,
    section: "Performance Testing",
    description: "Summary of all bench testing performed",
    status: "todo",
  },
];

export function SubmissionChecklist({
  submissionId,
}: SubmissionChecklistProps) {
  const [checklistItems, setChecklistItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating API call with mock data
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setChecklistItems(mockChecklistItems);
      setIsLoading(false);
    };
    loadData();
  }, [submissionId]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-teal-600" />;
      case "review_needed":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "todo":
        return <Circle className="h-5 w-5 text-gray-400" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "COMPLETED";
      case "review_needed":
        return "REVIEW NEEDED";
      case "todo":
        return "TO DO";
      default:
        return "TO DO";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-teal-100 text-teal-800";
      case "review_needed":
        return "bg-yellow-100 text-yellow-800";
      case "todo":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCardBgColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "healthcare-checklist-completed";
      case "review_needed":
        return "healthcare-checklist-review";
      case "todo":
        return "healthcare-checklist-todo";
      default:
        return "healthcare-checklist-todo";
    }
  };

  const handleStatusChange = (itemId: number, newStatus: string) => {
    setChecklistItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Submission Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progress = checklistItems ? calculateProgress(checklistItems) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
              Submission Checklist
            </CardTitle>
            <p className="text-gray-600">
              Track completion of required 510(k) submission sections
            </p>
          </div>
          <div className="bg-teal-50 p-3 rounded-lg">
            <CheckCircle className="h-6 w-6 text-teal-600" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {checklistItems && checklistItems.length > 0 ? (
          <>
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Overall Progress
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {progress}% Complete
                </span>
              </div>
              <Progress value={progress} className="w-full h-2" />
            </div>

            {/* Checklist items */}
            <div className="space-y-4">
              {checklistItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start space-x-3 p-4 rounded-lg border ${getCardBgColor(
                    item.status
                  )}`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={`font-medium ${
                          item.status === "completed"
                            ? "text-teal-900"
                            : item.status === "review_needed"
                            ? "text-yellow-900"
                            : "text-gray-900"
                        }`}
                      >
                        {item.section}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusBadgeColor(item.status)}>
                          {getStatusLabel(item.status)}
                        </Badge>
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(item.id, e.target.value)
                          }
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="todo">To Do</option>
                          <option value="review_needed">Review Needed</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                    <p
                      className={`text-sm mb-2 ${
                        item.status === "completed"
                          ? "text-teal-700"
                          : item.status === "review_needed"
                          ? "text-yellow-700"
                          : "text-gray-600"
                      }`}
                    >
                      {item.description}
                    </p>
                    {item.aiNotes && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Info className="h-3 w-3" />
                        <span
                          className={
                            item.status === "completed"
                              ? "text-teal-600"
                              : item.status === "review_needed"
                              ? "text-yellow-600"
                              : "text-gray-500"
                          }
                        >
                          {item.aiNotes}
                        </span>
                        {item.section === "Predicate Comparison Table" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-purple-600 hover:text-purple-700"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Alert */}
            <Alert className="mt-6 bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">
                    Progress Summary
                  </h4>
                  <AlertDescription className="text-blue-700">
                    {
                      checklistItems.filter(
                        (item) => item.status === "completed"
                      ).length
                    }{" "}
                    of {checklistItems.length} sections completed.
                    {checklistItems.filter(
                      (item) => item.status === "review_needed"
                    ).length > 0 && (
                      <>
                        {" "}
                        {
                          checklistItems.filter(
                            (item) => item.status === "review_needed"
                          ).length
                        }{" "}
                        section
                        {checklistItems.filter(
                          (item) => item.status === "review_needed"
                        ).length > 1
                          ? "s"
                          : ""}{" "}
                        need
                        {checklistItems.filter(
                          (item) => item.status === "review_needed"
                        ).length === 1
                          ? "s"
                          : ""}{" "}
                        review.
                      </>
                    )}
                    {progress === 100
                      ? " Your submission is ready for final review!"
                      : " Continue working on pending sections."}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          </>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Checklist Available
            </h3>
            <p className="text-gray-600">
              Checklist will be generated based on your submission pathway and
              requirements.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
