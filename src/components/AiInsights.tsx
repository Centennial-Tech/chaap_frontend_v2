import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { 
  Bot, 
  TrendingUp, 
  Clock, 
  Shield, 
  Database, 
  ArrowRight,
  Sparkles
} from "lucide-react";

interface AiInsight {
  id: number | string;
  title: string;
  description: string;
  insightType: string;
  confidence?: number;
  metadata?: Record<string, unknown>;
  actionable: boolean;
}

interface AiInsightsProps {
  submissionId: number;
}

export function AiInsights({ submissionId }: AiInsightsProps) {
  const { data: aiInsights, isLoading } = useQuery<AiInsight[]>({
    queryKey: ["/api/submissions", submissionId, "insights"],
    enabled: !!submissionId,
  });

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
        return "bg-gray-500";
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
        return "bg-gradient-to-r from-gray-50 to-gray-100";
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
            {aiInsights.map((insight) => (
              <div
                key={insight.id}
                className={`${getInsightBgGradient(insight.insightType)} rounded-lg p-4 transition-all duration-200 hover:shadow-sm`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`${getInsightColor(insight.insightType)} p-2 rounded-lg flex-shrink-0`}>
                    {getInsightIcon(insight.insightType)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {insight.title}
                    </h4>
                    <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                      {insight.description}
                    </p>
                    
                    {/* Show confidence or progress for relevant insights */}
                    {insight.confidence && insight.insightType === "success_probability" && (
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
                    {insight.metadata && insight.insightType === "timeline_optimization" && (
                      <div className="text-xs text-orange-700 mb-3">
                        Potential time savings: {(insight.metadata as any).time_saved}
                      </div>
                    )}

                    {/* Show actionable button for actionable insights */}
                    {insight.actionable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-auto p-0 text-sm font-medium ${getActionButtonColor(insight.insightType)}`}
                      >
                        <ArrowRight className="h-3 w-3 mr-1" />
                        {insight.insightType === "timeline_optimization" && "View Optimization"}
                        {insight.insightType === "regulatory_risk" && "View Mitigation"}
                        {insight.insightType === "real_world_evidence" && "Learn More"}
                        {insight.insightType === "success_probability" && "View Details"}
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No AI Insights Available</h3>
            <p className="text-gray-600 mb-4">
              AI insights will be generated based on your submission data and regulatory patterns.
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Insights
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 