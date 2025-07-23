import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import Modal from "./ui/Modal";
import {
  Bot,
  TrendingUp,
  Clock,
  Shield,
  Database,
  ArrowRight,
  Sparkles,
  Lightbulb,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

export function AiInsights({ aiInsights, isLoading }: any) {
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getInsightIcon = (insightType: string) => {
    switch (insightType) {
      case "success_probability":
        return <TrendingUp className="h-5 w-5 text-white" />;
      case "timeline_optimization":
        return <Clock className="h-5 w-5 text-white" />;
      case "regulatory_risk":
        return <Shield className="h-5 w-5 text-white" />;
      case "real_world_evidence":
        return <Database className="h-5 w-5 text-white" />;
      default:
        return <Sparkles className="h-5 w-5 text-white" />;
    }
  };

  const getInsightColor = (insightType: string) => {
    switch (insightType) {
      case "success_probability":
        return "bg-teal-500";
      case "timeline_optimization":
        return "bg-orange-500";
      case "regulatory_risk":
        return "bg-purple-500";
      case "real_world_evidence":
        return "bg-blue-500";
      default:
        return "bg-orange-500";
    }
  };

  const getInsightBgGradient = (insightType: string) => {
    switch (insightType) {
      case "success_probability":
        return "healthcare-insight-success";
      case "timeline_optimization":
        return "bg-gradient-to-r from-orange-50 to-orange-100";
      case "regulatory_risk":
        return "bg-gradient-to-r from-purple-50 to-purple-100";
      case "real_world_evidence":
        return "healthcare-insight-info";
      default:
        return "bg-gradient-to-r from-orange-50 to-orange-100";
    }
  };

  const getInsightShadowColor = (insightType: string) => {
    switch (insightType) {
      case "success_probability":
        return "shadow-lg hover:shadow-xl"; // back to simple shadow
      case "timeline_optimization":
        return "shadow-lg hover:shadow-xl";
      case "regulatory_risk":
        return "shadow-lg hover:shadow-xl";
      case "real_world_evidence":
        return "shadow-lg hover:shadow-xl";
      default:
        return "shadow-lg hover:shadow-xl";
    }
  };

  const getActionButtonColor = (insightType: string) => {
    switch (insightType) {
      case "success_probability":
        return "text-teal-600 hover:text-teal-700";
      case "timeline_optimization":
        return "text-orange-600 hover:text-orange-700";
      case "regulatory_risk":
        return "text-purple-600 hover:text-purple-700";
      case "real_world_evidence":
        return "text-blue-600 hover:text-blue-700";
      default:
        return "text-gray-600 hover:text-gray-700";
    }
  };

  const handleViewDetails = (insight: any) => {
    setSelectedInsight(insight);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInsight(null);
  };

  if (isLoading) {
    return (
      <Card className="healthcare-card">
        <CardHeader>
          <CardTitle>AI Strategic Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="healthcare-card healthcare-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
              AI Strategic Insights
            </CardTitle>
            <p className="text-gray-600">
              Personalized recommendations based on your submission profile
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-100 to-teal-100 p-3 rounded-lg">
            <Bot className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {aiInsights && aiInsights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiInsights.map((insight: any) => (
              <div
                key={insight.id}
                className={`${getInsightBgGradient(
                  insight.insightType
                )} rounded-lg p-4 transition-all duration-300 ${getInsightShadowColor(insight.insightType)}`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`${getInsightColor(
                      insight.insightType
                    )} p-2 rounded-lg flex-shrink-0`}
                  >
                    {getInsightIcon(insight.insightType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {insight.title}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {insight.description}
                    </p>

                    {/* Show confidence or progress for relevant insights */}
                    {insight.confidence &&
                      insight.insightType === "success_probability" && (
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-20 bg-teal-200 rounded-full h-2">
                            <div
                              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${insight.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-teal-600 font-medium">
                            {insight.confidence}%
                          </span>
                        </div>
                      )}

                    {/* Show metadata for timeline optimization */}
                    {insight.metadata &&
                      insight.insightType === "timeline_optimization" && (
                        <div className="text-xs text-orange-700 mb-3">
                          Potential time savings:{" "}
                          {(insight.metadata as any).time_saved}
                        </div>
                      )}

                    {/* Show actionable button for actionable insights */}
                    {insight.actionable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-auto p-0 text-sm font-medium ${getActionButtonColor(
                          insight.insightType
                        )}`}
                        onClick={() => handleViewDetails(insight)}
                      >
                        <ArrowRight className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No AI Insights Available
            </h3>
            <p className="text-gray-600 mb-4">
              AI insights will be generated based on your submission data and
              regulatory patterns.
            </p>
          </div>
        )}
      </CardContent>

      {/* Insight Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedInsight?.title || "Insight Details"}
        maxWidth="max-w-2xl"
      >
        {selectedInsight && (
          <div className="space-y-6">
            {/* Insight Header */}
            <div className="flex items-start space-x-3">
              <div
                className={`${getInsightColor(
                  selectedInsight.insightType
                )} p-3 rounded-lg flex-shrink-0`}
              >
                {getInsightIcon(selectedInsight.insightType)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedInsight.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedInsight.description}
                </p>
                {selectedInsight.confidence && (
                  <div className="flex items-center space-x-2 mt-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${selectedInsight.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-teal-600 font-medium">
                      {selectedInsight.confidence}% confidence
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Reasoning Section */}
            {selectedInsight.reasoningActions?.reasoning && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                  <h4 className="text-lg font-medium text-blue-900">
                    AI Reasoning
                  </h4>
                </div>
                <p className="text-blue-800 leading-relaxed">
                  {selectedInsight.reasoningActions.reasoning}
                </p>
              </div>
            )}

            {/* Actions Section */}
            {selectedInsight.reasoningActions?.actions && 
             selectedInsight.reasoningActions.actions.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="text-lg font-medium text-green-900">
                    Recommended Actions
                  </h4>
                </div>
                <ul className="space-y-2">
                  {selectedInsight.reasoningActions.actions.map((action: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="inline-block w-2 h-2 mt-2 bg-green-500 rounded-full flex-shrink-0"></span>
                      <span className="text-green-800 leading-relaxed">
                        {action}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional Metadata */}
            {selectedInsight.metadata && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  Additional Information
                </h4>
                <div className="space-y-2">
                  {Object.entries(selectedInsight.metadata).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="text-sm text-gray-600">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </Card>
  );
}
