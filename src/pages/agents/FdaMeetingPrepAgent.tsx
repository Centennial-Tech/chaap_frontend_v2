import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Plus, Activity, Calendar, FileText, Info, Lightbulb, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";

const FdaMeetingPrepAgent = () => {
  const [currentTab, setCurrentTab] = useState<'main' | 'product-info'>('main');
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [formData, setFormData] = useState({
    productType: '',
    developmentStage: '',
    productName: '',
    regulatoryObjective: ''
  });
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGetAIRecommendation = () => {
    // Simple object structure for AI team to populate
    const recommendation = {
      recommendedMeetingType: "End of Phase 2 (EOP2)",
      confidence: "High",
      reasoning: "Based on your Phase 2 clinical data and regulatory objectives, an EOP2 meeting is recommended to discuss trial design and endpoints for Phase 3.",
      keyTopics: [
        "Phase 3 trial design discussion",
        "Primary endpoint selection",
        "Safety monitoring plan",
        "Statistical analysis approach"
      ],
      timeline: "4-6 weeks to prepare",
      nextSteps: [
        "Prepare briefing document",
        "Schedule meeting with FDA",
        "Gather supporting data",
        "Review previous guidance"
      ],
      icon: "E",
      subtitle: "Meeting to discuss Phase 2 results and Phase 3 design",
      matchPercentage: "90%",
      justification: [
        "End-of-Phase 2 meetings are critical for Phase 3 planning",
        "Provides opportunity to discuss trial design and endpoints",
        "Helps align on Phase 3 study design and statistical approach"
      ],
      typicalQuestions: [
        "What is the recommended Phase 3 trial design?",
        "Are the proposed endpoints appropriate for approval?",
        "What additional safety monitoring is required?",
        "How should the statistical analysis be conducted?"
      ]
    };

    setAiRecommendation(recommendation);
    setShowRecommendation(true);
  };

  const isFormComplete = formData.productType && formData.developmentStage && formData.productName && formData.regulatoryObjective;

  if (currentTab === 'main') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[#0b0080] mb-2">FDA Meeting Preparation</h1>
            <p className="text-gray-600">Streamline your FDA meeting process with AI-powered assistance</p>
          </div>
          <Button className="flex items-center gap-2" onClick={() => setCurrentTab('product-info')}>
            <Plus className="w-5 h-5" />
            New Meeting Request
          </Button>
        </div>

        {/* Recent Submissions */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-900">Recent Submissions</h2>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recent submissions</h3>
                <p className="text-gray-500 mb-4">Create your first meeting request to get started</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Meeting Requests */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">All Meeting Requests</h2>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No meeting requests yet</h3>
                <p className="text-gray-500 mb-4">Create your first meeting request to get started</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#0b0080] mb-2">Meeting Type Identification</h1>
          <p className="text-gray-600">Recommend the appropriate FDA meeting type based on your product and development stage</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2" onClick={() => setCurrentTab('main')}>
          <ArrowLeft className="w-4 h-4" />
          Back to FDA Meeting Preparation Agent
        </Button>
      </div>

      {/* Product Information Form */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-6">
              <Info className="w-5 h-5 text-blue-500" />
              <h3>Product Information</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Product Type</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b0080] focus:border-[#0b0080]"
                    value={formData.productType}
                    onChange={(e) => handleInputChange('productType', e.target.value)}
                  >
                    <option value="">Select product type...</option>
                    <option value="drug">Drug</option>
                    <option value="biologic">Biologic</option>
                    <option value="device">Medical Device</option>
                    <option value="device">Combination Product</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Development Stage</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b0080] focus:border-[#0b0080]"
                    value={formData.developmentStage}
                    onChange={(e) => handleInputChange('developmentStage', e.target.value)}
                  >
                    <option value="">Select development stage...</option>
                    <option value="preclinical">Preclinical</option>
                    <option value="phase1">Phase 1</option>
                    <option value="phase2">Phase 2</option>
                    <option value="phase3">Phase 3</option>
                    <option value="pre-market">Pre-market</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b0080] focus:border-[#0b0080]"
                  placeholder="Enter product name"
                  value={formData.productName}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Regulatory Objective</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b0080] focus:border-[#0b0080]"
                  rows={4}
                  placeholder="Describe your regulatory objective (e.g., IND readiness, EOP2 design alignment)"
                  value={formData.regulatoryObjective}
                  onChange={(e) => handleInputChange('regulatoryObjective', e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button
                className={`flex items-center gap-2 ${!isFormComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleGetAIRecommendation}
                disabled={!isFormComplete}
              >
                <Lightbulb className="w-5 h-5" />
                Get AI Recommendation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation Section */}
      {showRecommendation && aiRecommendation && (
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center justify-center">
                <Lightbulb className="w-7 h-7 text-yellow-500" />
              </span>
              <h2 className="text-xl font-semibold text-gray-900">Recommended Meeting Type</h2>
            </div>
            <div
              className="space-y-6 p-8 rounded-xl"
              style={{
                background: "linear-gradient(90deg, #f8fafc 0%, #e0e7ff 100%)",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 8px 0 rgba(16,30,54,0.04)",
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{aiRecommendation.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{aiRecommendation.recommendedMeetingType}</h3>
                    <p className="text-gray-500 text-sm">{aiRecommendation.subtitle}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-green-600 font-semibold text-sm mb-1">{aiRecommendation.matchPercentage} Match</span>
                  <span className="text-gray-400 text-xs">Confidence Score</span>
                  <span className="text-gray-400 text-xs">{aiRecommendation.timeline}</span>
                </div>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Justification</h5>
                  <ul className="space-y-2 text-sm">
                    {aiRecommendation.justification?.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="inline-block w-2 h-2 mt-2 bg-green-500 rounded-full"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Typical Questions</h5>
                  <ul className="space-y-2 text-sm">
                    {aiRecommendation.typicalQuestions?.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="inline-block w-1.5 h-1.5 mt-2 bg-gray-400 rounded-full"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FdaMeetingPrepAgent; 