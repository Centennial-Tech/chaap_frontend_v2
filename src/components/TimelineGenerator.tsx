import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/Table";
import {
  CalendarDays,
  Edit,
  Plus,
  // CheckCircle,
  // Clock,
  // Circle,
} from "lucide-react";

export function TimelineGenerator({ timelineItems, isLoading }: any) {
  // const getStatusIcon = (status: string) => {
  //   switch (status?.toLowerCase()) {
  //     case "completed":
  //       return <CheckCircle className="h-4 w-4 text-white" />;
  //     case "in_progress":
  //       return <Clock className="h-4 w-4 text-white" />;
  //     case "pending":
  //       return <Circle className="h-4 w-4 text-white" />;
  //     default:
  //       return <Circle className="h-4 w-4 text-white" />;
  //   }
  // };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-teal-100 text-teal-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
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

  const handleStatusChange = (_timelineId: number, _newStatus: string) => {
    // setTimelineItems((prev) =>
    //   prev.map((item) =>
    //     item.id === timelineId ? { ...item, status: newStatus } : item
    //   )
    // );
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
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalDuration = timelineItems?.reduce((acc: any, item: any) => {
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left font-medium text-gray-900">
                      Phase
                    </TableHead>
                    <TableHead className="text-left font-medium text-gray-900">
                      Description
                    </TableHead>
                    <TableHead className="text-left font-medium text-gray-900">
                      Duration
                    </TableHead>
                    <TableHead className="text-left font-medium text-gray-900">
                      Status
                    </TableHead>
                    <TableHead className="text-left font-medium text-gray-900">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timelineItems.map((item: any) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {item.phaseName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {item.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">
                          {item.weekRange || item.duration}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusLabel(item.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(item.id, e.target.value)
                          }
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
