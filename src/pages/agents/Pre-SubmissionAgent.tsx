import { CheckCircle, Lightbulb, Download, ChevronDown } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { PathwayRecommendation } from "../../components/PathwayRecommendation";
import { PredicateMatching } from "../../components/PredicateMatching";
import { TestingRoadmap } from "../../components/TestingRoadmap";
import { TimelineGenerator } from "../../components/TimelineGenerator";
import { SubmissionChecklist } from "../../components/SubmissionChecklist";
import { ReviewerSimulation } from "../../components/ReviewerSimulation";
import { AiInsights } from "../../components/AiInsights";
import { useState } from "react";
import api from "../../api";

const PreSubmissionStrategyAgent = () => {
  const [showExportOptions, setShowExportOptions] = useState(false);

  const handleExport = (format: string) => {
    // TODO: Implement export functionality
    console.log(`Exporting as ${format}`);
    setShowExportOptions(false);
  };

  const [isTestingRoadmapLoading, setIsTestingRoadmapLoading] = useState(false);

  const [testingRequirements, setTestingRequirements] = useState([]);

  const [SubmissionChecklistData, setSubmissionChecklistData] = useState([]);
  const [isSubmissionChecklistLoading, setIsSubmissionChecklistLoading] =
    useState(false);

  const callApi = async (type: string) => {
    const response = await api.post(`/agent/pre_submission?type=${type}`, {
      productType: "Wireless Continuous Glucose Monitoring System",
      riskClassification: "Class II",
      intendedUse:
        "The Wireless Continuous Glucose Monitoring System is intended for use by individuals with diabetes mellitus for continuous, real-time measurement of interstitial fluid glucose levels in order to help manage insulin therapy. Data are transmitted wirelessly to a compatible mobile application for trend analysis and alerting of hypo- or hyperglycemic excursions.",
      technologicalCharacteristics:
        "Subcutaneous, disposable enzyme-based electrochemical sensor using a platinum electrode and glucose oxidase chemistry.",
    });
    return response.data.messages[0];
  };

  const handleTestingRoadmap = async () => {
    setIsTestingRoadmapLoading(true);
    const data = await callApi("TESTING_ROADMAP");
    setTestingRequirements(data?.testingRequirements || []);
    setIsTestingRoadmapLoading(false);
  };
  const handleSubmissionChecklist = async () => {
    setIsSubmissionChecklistLoading(true);
    const data = await callApi("SUBMISSION_CHECKLIST");
    setSubmissionChecklistData(data?.documentChecklist || []);
    setIsSubmissionChecklistLoading(false);
  };

  const handleSubmit = async () => {
    await Promise.allSettled([
      handleTestingRoadmap(),
      handleSubmissionChecklist(),
    ]);
  };
  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex justify-end mb-6">
          <div className="relative">
            <Button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="bg-[#9333EA] hover:bg-[#7E22CE] text-white rounded-full px-6 py-2 flex items-center gap-2 text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {showExportOptions && (
              <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-xl shadow-lg py-1 z-50">
                <button
                  onClick={() => handleExport("pdf")}
                  className="w-full text-left px-4 py-2 hover:bg-purple-50 text-gray-700 text-sm flex items-center gap-3"
                >
                  <Download className="h-4 w-4 text-[#9333EA]" />
                  <span>Export as PDF</span>
                </button>
                <button
                  onClick={() => handleExport("txt")}
                  className="w-full text-left px-4 py-2 hover:bg-purple-50 text-gray-700 text-sm flex items-center gap-3"
                >
                  <Download className="h-4 w-4 text-[#9333EA]" />
                  <span>Export as TXT</span>
                </button>
                <button
                  onClick={() => handleExport("docx")}
                  className="w-full text-left px-4 py-2 hover:bg-purple-50 text-gray-700 text-sm flex items-center gap-3"
                >
                  <Download className="h-4 w-4 text-[#9333EA]" />
                  <span>Export as DOCX</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-950 text-white border-none">
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Navigate FDA Submissions with Confidence
                </h2>
                <p className="text-white mb-6 text-lg">
                  Get AI-powered guidance for your regulatory pathway, predicate
                  matching, and testing requirements. Streamline your FDA
                  pre-submission strategy with expert insights.
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

        <PathwayRecommendation callback={handleSubmit} />
        <PredicateMatching submissionId={1} />
        <TestingRoadmap
          testingRequirements={testingRequirements}
          isLoading={isTestingRoadmapLoading}
        />
        <TimelineGenerator submissionId={1} />
        <SubmissionChecklist
          checklistItems={SubmissionChecklistData}
          isLoading={isSubmissionChecklistLoading}
        />
        <ReviewerSimulation submissionId={1} />
        <AiInsights submissionId={1} />
      </main>
    </div>
  );
};

export default PreSubmissionStrategyAgent;
