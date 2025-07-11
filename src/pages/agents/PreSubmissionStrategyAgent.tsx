import { CheckCircle, Lightbulb } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { PathwayRecommendation } from "../../components/PathwayRecommendation";
import { PredicateMatching } from "../../components/PredicateMatching";
import { TestingRoadmap } from "../../components/TestingRoadmap";
import { TimelineGenerator } from "../../components/TimelineGenerator";
import { SubmissionChecklist } from "../../components/SubmissionChecklist";
import { ReviewerSimulation } from "../../components/ReviewerSimulation";
import { AiInsights } from "../../components/AiInsights";

const PreSubmissionStrategyAgent = () => {
  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Card className="bg-gradient-to-r from-purple-500 to-purple-950 text-white border-none">
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Navigate FDA Submissions with Confidence</h2>
                <p className="text-white mb-6 text-lg">
                  Get AI-powered guidance for your regulatory pathway, predicate matching, and testing requirements. 
                  Streamline your FDA pre-submission strategy with expert insights.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <span className="text-sm">Pathway Recommendation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <span className="text-sm">Predicate Matching</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <span className="text-sm">Testing Roadmap</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <span className="text-sm">Project Timeline</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <span className="text-sm">Submission Checklist</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <span className="text-sm">Reviewer Simulation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <span className="text-sm">AI Strategic Insights</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex justify-center items-center">
                <Lightbulb className="h-32 w-32 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <PathwayRecommendation submissionId={1} />
        <PredicateMatching submissionId={1} />
        <TestingRoadmap submissionId={1} />
        <TimelineGenerator submissionId={1} />
        <SubmissionChecklist submissionId={1} />
        <ReviewerSimulation submissionId={1} />
        <AiInsights submissionId={1} />
      </main>
    </div>
  );
};

export default PreSubmissionStrategyAgent; 