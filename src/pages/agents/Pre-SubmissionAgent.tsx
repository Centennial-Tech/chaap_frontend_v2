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

  const [projectTimelineItems, setProjectTimelineItems] = useState([]);
  const [isProjectTimelineLoading, setIsProjectTimelineLoading] =
    useState(false);

  const [pathwayRecommendation, setPathwayRecommendation] = useState({});
  const [isPathwayLoading, setIsPathwayLoading] = useState(false);

  const callApi = async (type: string, formData: any) => {
    const {
      productType,
      riskClassification,
      intendedUse,
      technologicalCharacteristics,
      predicateDevice,
    } = formData;

    const response = await api.post(`/agent/pre_submission?type=${type}`, {
      productType: productType,
      riskClassification: riskClassification,
      intendedUse: intendedUse,
      technologicalCharacteristics: technologicalCharacteristics,
      predicateDevice: predicateDevice,
    });
    return response.data.messages[0];
  };

  const handleTestingRoadmap = async (formData: any) => {
    setIsTestingRoadmapLoading(true);
    const data = await callApi("TESTING_ROADMAP", formData);
    setTestingRequirements(data?.testingRequirements || []);
    setIsTestingRoadmapLoading(false);
  };
  const handleSubmissionChecklist = async (formData: any) => {
    setIsSubmissionChecklistLoading(true);
    const data = await callApi("SUBMISSION_CHECKLIST", formData);
    setSubmissionChecklistData(data?.documentChecklist || []);
    setIsSubmissionChecklistLoading(false);
  };

  const handleProjectTimeline = async (formData: any) => {
    setIsProjectTimelineLoading(true);
    const data = await callApi("PROJECT_TIMELINE", formData);
    setProjectTimelineItems(data?.timeline || []);
    setIsProjectTimelineLoading(false);
  };

  const handlePathwayRecommendation = async (formData: any) => {
    setIsPathwayLoading(true);
    const data = await callApi("PATHWAY_RECOMMENDATION", formData);
    setPathwayRecommendation(data || []);
    setIsPathwayLoading(false);
  };

  const handleSubmit = async (formData: any) => {
    await Promise.allSettled([
      handleTestingRoadmap(formData),
      handleSubmissionChecklist(formData),
      handleProjectTimeline(formData),
      handlePathwayRecommendation(formData),
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

        <PathwayRecommendation
          callback={handleSubmit}
          recommendation={pathwayRecommendation}
          isLoading={isPathwayLoading}
        />
        <PredicateMatching submissionId={1} />
        <TestingRoadmap
          testingRequirements={testingRequirements}
          isLoading={isTestingRoadmapLoading}
        />
        <TimelineGenerator
          timelineItems={projectTimelineItems}
          isLoading={isProjectTimelineLoading}
        />
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
