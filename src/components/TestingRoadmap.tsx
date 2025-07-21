import { Card, CardContent, CardHeader, CardTitle, Badge } from "./ui";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/Table";
import {
  FlaskConical,
  Shield,
  Zap,
  Wifi,
  BarChart3,
  Lock,
  AlertTriangle,
} from "lucide-react";

export function TestingRoadmap({
  testingRequirements,
  isLoading = false,
}: any) {
  const getTestIcon = (testType: string) => {
    if (!testType) return <FlaskConical className="h-4 w-4 text-gray-600" />;

    switch (testType?.toLowerCase()) {
      case "biocompatibility":
        return <Shield className="h-4 w-4 text-red-600" />;
      case "electrical safety":
        return <Zap className="h-4 w-4 text-yellow-600" />;
      case "emc & wireless":
        return <Wifi className="h-4 w-4 text-blue-600" />;
      case "performance testing":
        return <BarChart3 className="h-4 w-4 text-green-600" />;
      case "cybersecurity":
        return <Lock className="h-4 w-4 text-purple-600" />;
      default:
        return <FlaskConical className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTestIconBg = (testType: string) => {
    if (!testType) return "bg-gray-100";

    switch (testType?.toLowerCase()) {
      case "biocompatibility":
        return "bg-red-100";
      case "electrical safety":
        return "bg-yellow-100";
      case "emc & wireless":
        return "bg-blue-100";
      case "performance testing":
        return "bg-green-100";
      case "cybersecurity":
        return "bg-purple-100";
      default:
        return "bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toString()?.toLowerCase()) {
      case "1":
        return "bg-red-100 text-red-800";
      case "2":
        return "bg-orange-100 text-orange-800";
      case "3":
        return "bg-yellow-100 text-yellow-800";
      case "4":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Card className="healthcare-card">
        <CardHeader>
          <CardTitle>Testing Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const criticalTests =
    testingRequirements?.filter((req: any) => req.priority === "Critical") ||
    [];
  const totalDuration =
    testingRequirements?.reduce((acc: any, req: any) => {
      // Extract the first number from strings like "8-12 weeks"
      const weeks = parseInt(req.duration?.split("-")[0]) || 0;
      return acc + weeks;
    }, 0) || 0;

  return (
    <Card className="healthcare-card healthcare-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
              Testing Roadmap
            </CardTitle>
            <p className="text-gray-600">
              Required testing based on your device classification and intended
              use
            </p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <FlaskConical className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {testingRequirements && testingRequirements.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left font-medium text-gray-900">
                      Test Type
                    </TableHead>
                    <TableHead className="text-left font-medium text-gray-900">
                      Standard/Guideline
                    </TableHead>
                    <TableHead className="text-left font-medium text-gray-900">
                      Priority
                    </TableHead>
                    <TableHead className="text-left font-medium text-gray-900">
                      Duration
                    </TableHead>
                    <TableHead className="text-left font-medium text-gray-900">
                      Notes
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testingRequirements.map((requirement: any) => (
                    <TableRow key={requirement.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-lg ${getTestIconBg(
                              requirement.testType
                            )}`}
                          >
                            {getTestIcon("")}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {requirement.testType}
                            </div>
                            <div className="text-sm text-gray-500">
                              {requirement.testType === "Biocompatibility" &&
                                "Skin contact safety"}
                              {requirement.testType === "Electrical Safety" &&
                                "Medical device standards"}
                              {requirement.testType === "EMC & Wireless" &&
                                "Communication testing"}
                              {requirement.testType === "Performance Testing" &&
                                "Accuracy validation"}
                              {requirement.testType === "Cybersecurity" &&
                                "Data protection"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {requirement.standardsOrGuideline}
                          </div>
                          <div className="text-gray-500">
                            {requirement.testType === "Biocompatibility" &&
                              "Biological evaluation"}
                            {requirement.testType === "Electrical Safety" &&
                              "Medical electrical equipment"}
                            {requirement.testType === "EMC & Wireless" &&
                              "EMC & radio frequency"}
                            {requirement.testType === "Performance Testing" &&
                              "Bench testing"}
                            {requirement.testType === "Cybersecurity" &&
                              "Security controls"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getPriorityColor(requirement.priority)}
                        >
                          {requirement.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-900">
                        {requirement.duration || "8-12 weeks"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {requirement.notes}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900 mb-1">
                    Testing Priority Alert
                  </h4>
                  <p className="text-orange-700">
                    {criticalTests.length > 0 && (
                      <>
                        {criticalTests.length} critical test
                        {criticalTests.length > 1 ? "s" : ""} should be
                        initiated immediately.
                      </>
                    )}
                    Total estimated testing duration:{" "}
                    {Math.ceil(totalDuration / 4)}-
                    {Math.ceil(totalDuration / 3)} weeks.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <FlaskConical className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Testing Requirements
            </h3>
            <p className="text-gray-600">
              Testing requirements will be generated based on your device
              classification and intended use.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
