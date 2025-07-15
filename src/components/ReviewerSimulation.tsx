import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Alert, AlertDescription } from "./ui/Alert";
import {
  UserCheck,
  HelpCircle,
  ExternalLink,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";

interface ReviewerQuestion {
  id: number | string;
  question: string;
  priority: string;
  category: string;
  linkedSection?: string;
  response?: string;
}

interface ReviewerSimulationProps {
  submissionId: number;
}

export function ReviewerSimulation({ submissionId }: ReviewerSimulationProps) {
  //   const { data: reviewerQuestions, isLoading } = useQuery<ReviewerQuestion[]>({
  //     queryKey: ["/api/submissions", submissionId, "questions"],
  //     enabled: !!submissionId,
  //   });

  const [isLoading, setIsLoading] = useState(false);
  const reviewerQuestions: ReviewerQuestion[] = [
    {
      id: 1,
      question: "What is the intended use of the device?",
      priority: "high",
      category: "General",
      linkedSection: "Device Description",
    },
    {
      id: 2,
      question: "What are the technological characteristics?",
      priority: "medium",
      category: "Technical",
    },
    {
      id: 3,
      question: "How does this device compare to predicate devices?",
      priority: "critical",
      category: "Substantial Equivalence",
      linkedSection: "Predicate Analysis",
    },
  ];

  const safeGetPriorityIcon = (priority: unknown) => {
    if (!priority || typeof priority !== "string") {
      return <HelpCircle className="h-4 w-4 text-gray-600" />;
    }

    const priorityLower = priority.toLowerCase();

    switch (priorityLower) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "high":
        return <HelpCircle className="h-4 w-4 text-orange-600" />;
      case "medium":
        return <HelpCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const safeGetPriorityColor = (priority: unknown) => {
    if (!priority || typeof priority !== "string") {
      return "bg-gray-100 text-gray-800";
    }

    const priorityLower = priority.toLowerCase();

    switch (priorityLower) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const safeGetCategoryColor = (category: unknown) => {
    if (!category || typeof category !== "string") {
      return "text-gray-600 hover:text-gray-700";
    }

    const categoryLower = category.toLowerCase();

    switch (categoryLower) {
      case "substantial equivalence":
        return "text-purple-600 hover:text-purple-700";
      case "cybersecurity":
        return "text-red-600 hover:text-red-700";
      case "performance":
        return "text-green-600 hover:text-green-700";
      case "labeling":
        return "text-blue-600 hover:text-blue-700";
      case "testing":
        return "text-orange-600 hover:text-orange-700";
      default:
        return "text-gray-600 hover:text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <Card className="healthcare-card">
        <CardHeader>
          <CardTitle>FDA Reviewer Simulation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-16 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Safely filter valid questions
  const validQuestions = Array.isArray(reviewerQuestions)
    ? reviewerQuestions.filter((q): q is ReviewerQuestion => {
        return (
          q &&
          typeof q === "object" &&
          "id" in q &&
          "question" in q &&
          "priority" in q &&
          "category" in q &&
          typeof q.question === "string" &&
          q.question.length > 0
        );
      })
    : [];

  return (
    <Card className="healthcare-card healthcare-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
              FDA Reviewer Simulation
            </CardTitle>
            <p className="text-gray-600">
              Anticipate potential reviewer questions and prepare responses
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <UserCheck className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {validQuestions.length > 0 ? (
          <>
            <div className="space-y-4 mb-6">
              {validQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                      {safeGetPriorityIcon(question.priority)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          Question {index + 1}: {question.category || "General"}
                        </h4>
                        <Badge
                          className={safeGetPriorityColor(question.priority)}
                        >
                          {question.priority || "Unknown"} Priority
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        "{question.question}"
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        {question.linkedSection && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-auto p-0 font-medium ${safeGetCategoryColor(
                              question.category
                            )}`}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Link to {question.linkedSection}
                          </Button>
                        )}
                        {question.response && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            Response Prepared
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Pro Tip:</strong> Prepare detailed, evidence-based
                responses to critical and high-priority questions first.
                Consider how each answer strengthens your submission's
                regulatory position.
              </AlertDescription>
            </Alert>
          </>
        ) : (
          <div className="text-center py-8">
            <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Reviewer Questions Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Reviewer questions will be generated based on your submission
              details and predicate analysis.
            </p>
            <Button className="healthcare-button-primary">
              <Lightbulb className="h-4 w-4 mr-2" />
              Generate Questions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
