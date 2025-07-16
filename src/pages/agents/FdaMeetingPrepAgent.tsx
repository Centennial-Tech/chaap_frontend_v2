import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Plus, Activity, Calendar, FileText, Info, Lightbulb, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";

// Dummy data structure for AI recommendations
const dummyAIRecommendation = {
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
  ]
};

const FdaMeetingPrepAgent = () => {
  const [currentTab, setCurrentTab] = useState<'main' | 'product-info'>('main');
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [formData, setFormData] = useState({
    productType: '',
    developmentStage: '',
    productName: '',
    regulatoryObjective: ''
  });
  const [aiRecommendation, setAiRecommendation] = useState(dummyAIRecommendation);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGetAIRecommendation = () => {
    // Simulate AI processing
    console.log('Form data submitted:', formData);
    // In real implementation, this would call the AI/backend API
    // const response = await api.post('/ai/recommend-meeting-type', formData);
    // setAiRecommendation(response.data);

    setShowRecommendation(true);
  };

  const handleBack = () => {
    setCurrentTab('main');
    setShowRecommendation(false);
  };

  const handleCreateNewRequest = () => {
    setCurrentTab('product-info');
    setShowRecommendation(false);
  };

  const handleCreateMeetingRequest = () => {
    // Handle creating the meeting request
    console.log('Creating meeting request with:', { formData, aiRecommendation });
    setCurrentTab('main');
    setShowRecommendation(false);
    setFormData({
      productType: '',
      developmentStage: '',
      productName: '',
      regulatoryObjective: ''
    });
  };

  const renderMainTab = () => (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#0b0080] mb-2">FDA Meeting Preparation</h1>
          <p className="text-gray-600">Streamline your FDA meeting process with AI-powered assistance</p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={handleCreateNewRequest}
        >
          <Plus className="w-5 h-5" />
          New Meeting Request
        </Button>
      </div>

      {/* Recent Submissions Section */}
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

      {/* All Meeting Requests Section */}
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
    </>
  );

  const renderMeetingTypeIdentificationTab = () => (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#0b0080] mb-2">Meeting Type Identification</h1>
          <p className="text-gray-600">Recommend the appropriate FDA meeting type based on your product and development stage</p>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to FDA Meeting Preparation Agent
        </Button>
      </div>

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
                  <label className="block text-sm font-medium text-gray-700">
                    Product Type
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700">
                    Development Stage
                  </label>
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
                <label className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b0080] focus:border-[#0b0080]"
                  placeholder="Enter product name"
                  value={formData.productName}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Regulatory Objective
                </label>
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
                className="flex items-center gap-2"
                onClick={handleGetAIRecommendation}
              >
                <Lightbulb className="w-5 h-5" />
                Get AI Recommendation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation Section - expands downward */}
      {showRecommendation && (
        <Card>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">E</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{aiRecommendation.recommendedMeetingType}</h3>
                    <p className="text-gray-600">Meeting to discuss Phase 1 results and Phase 2 design</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="border-2 border-green-500 text-green-500 px-3 py-1 rounded-lg text-sm font-semibold mb-1 text-center">
                    90% Match
                  </div>
                  <p className="text-gray-500 text-xs text-center">Confidence Score</p>
                  <p className="text-gray-500 text-xs text-center">{aiRecommendation.timeline}</p>
                </div>
              </div>

              {/* Content Section - Two Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
                {/* Left Column - Justification */}
                <div className="space-y-4">
                  <h5 className="font-bold text-gray-900">Justification</h5>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-5 h-5 border-2 border-green-500 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>End-of-Phase 1 meetings are critical for Phase 2 planning</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-5 h-5 border-2 border-green-500 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Provides opportunity to discuss dose selection</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-5 h-5 border-2 border-green-500 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Helps align on Phase 2 study design and endpoints</span>
                    </li>
                  </ul>
                </div>

                {/* Right Column - Typical Questions */}
                <div className="space-y-4">
                  <h5 className="font-bold text-gray-900">Typical Questions</h5>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2"></div>
                      <span>What is the recommended Phase 2 dose?</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2"></div>
                      <span>Are the proposed endpoints appropriate?</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2"></div>
                      <span>What additional safety monitoring is required?</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <Button
                  className="flex items-center gap-2"
                  onClick={handleCreateMeetingRequest}
                >
                  Create Meeting Request
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {currentTab === 'main' && renderMainTab()}
      {currentTab === 'product-info' && renderMeetingTypeIdentificationTab()}
    </div>
  );
};

export default FdaMeetingPrepAgent; 