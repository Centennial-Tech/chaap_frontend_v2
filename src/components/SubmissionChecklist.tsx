import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Alert, AlertDescription } from "./ui/Alert";
import {
  CheckCircle2,
  AlertCircle,
  Circle,
  CheckCircle,
  Info,
  ExternalLink,
} from "lucide-react";


export function SubmissionChecklist({
  checklistItems,
  isLoading = false,
}: any) {


  //   const handleStatusChange = (itemId: number, newStatus: string) => {
  //     setChecklistItems((prev) =>
  //       prev.map((item) =>
  //         item.id === itemId ? { ...item, status: newStatus } : item
  //       )
  //     );
  //   };

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
            {/* Checklist items */}
            <div className="space-y-4">
              {checklistItems.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-3 p-4 rounded-lg border bg-white"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <Circle className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">
                        {item.section}
                      </h4>
                    </div>
                    <p className="text-sm mb-2 text-gray-600">
                      {item.description}
                    </p>
                    {item.aiNotes && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Info className="h-3 w-3" />
                        <span className="text-gray-500">
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
