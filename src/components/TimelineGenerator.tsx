import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import {
  CalendarDays,
  Edit,
  Plus,
  CheckCircle,
  Clock,
  Circle,
} from "lucide-react";

interface TimelineGeneratorProps {
  submissionId: number;
}

interface TimelineItem {
  id: number;
  phase: string;
  description: string;
  status: string;
  weekRange: string;
  targetDate: string;
  duration: string;
}

// Mock data for development
const mockTimelineItems: TimelineItem[] = [
  {
    id: 1,
    phase: "Initial Documentation",
    description: "Prepare and organize device documentation",
    status: "completed",
    weekRange: "Weeks 1-2",
    targetDate: "2024-03-15",
    duration: "2",
  },
  {
    id: 2,
    phase: "Testing Phase",
    description: "Complete required testing protocols",
    status: "in_progress",
    weekRange: "Weeks 3-8",
    targetDate: "2024-04-30",
    duration: "6",
  },
  {
    id: 3,
    phase: "Pre-submission Meeting",
    description: "FDA consultation and feedback",
    status: "pending",
    weekRange: "Weeks 9-10",
    targetDate: "2024-05-15",
    duration: "2",
  },
];

export function TimelineGenerator({ submissionId }: TimelineGeneratorProps) {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating API call with mock data
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTimelineItems(mockTimelineItems);
      setIsLoading(false);
    };
    loadData();
  }, [submissionId]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-white" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-white" />;
      case "pending":
        return <Circle className="h-4 w-4 text-white" />;
      default:
        return <Circle className="h-4 w-4 text-white" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-teal-600";
      case "in_progress":
        return "bg-yellow-400";
      case "pending":
        return "bg-gray-300";
      default:
        return "bg-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "✓ Completed";
      case "in_progress":
        return "⏳ In Progress";
      case "pending":
        return "⏸ Pending";
      default:
        return "⏸ Pending";
    }
  };

  const handleStatusChange = (timelineId: number, newStatus: string) => {
    setTimelineItems((prev) =>
      prev.map((item) =>
        item.id === timelineId ? { ...item, status: newStatus } : item
      )
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalDuration = timelineItems.reduce((acc, item) => {
    const weeks = parseInt(item.duration) || 0;
    return acc + weeks;
  }, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
              Project Timeline
            </CardTitle>
            <p className="text-gray-600">
              Interactive timeline with key milestones and dependencies
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <CalendarDays className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {timelineItems.length > 0 ? (
          <>
            {/* Timeline visualization */}
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

              <div className="space-y-6">
                {timelineItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative flex items-start space-x-4"
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full z-10 ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          {item.phase}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {item.weekRange}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {item.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <Badge
                          className={
                            item.status === "completed"
                              ? "bg-teal-100 text-teal-800"
                              : item.status === "in_progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {getStatusLabel(item.status)}
                        </Badge>
                        <span className="text-gray-500">
                          Target: {item.targetDate}
                        </span>
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(item.id, e.target.value)
                          }
                          className="text-xs border border-gray-300 rounded px-2 py-1 ml-2"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline controls */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Timeline
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Milestone
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                Total Duration: {totalDuration} weeks | Critical Path: Testing →
                Documentation → Submission
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Timeline Available
            </h3>
            <p className="text-gray-600 mb-4">
              Timeline will be generated based on your submission pathway and
              testing requirements.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate Timeline
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
