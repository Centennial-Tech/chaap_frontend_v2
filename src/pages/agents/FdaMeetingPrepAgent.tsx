import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Plus, Activity, Calendar, FileText, Info, Lightbulb, ArrowLeft, AlertCircle, CheckCircle, Wand2, HelpCircle, ChevronDown, CalendarDays } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { useNavigate } from "react-router-dom";

const FdaMeetingPrepAgent = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<'main' | 'product-info'>('main');
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [formData, setFormData] = useState({
    productType: '',
    developmentStage: '',
    productName: '',
    regulatoryObjective: ''
  });
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [meetingDate, setMeetingDate] = useState('');


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
      ],
      recommendedDocuments: [
        {
          id: "meeting-request-letter",
          title: "Meeting Request Letter",
          description: "Formal letter requesting the meeting with FDA",
          status: "required", // "required", "recommended", "optional", "completed"
          priority: "high"
        },
        {
          id: "product-development-summary",
          title: "Product Development Summary",
          description: "Comprehensive overview of your product and development program",
          status: "required",
          priority: "high"
        },
        {
          id: "cmc-information",
          title: "CMC Information Package",
          description: "Chemistry, Manufacturing, and Controls documentation",
          status: "recommended",
          priority: "medium"
        },
        {
          id: "risk-assessment",
          title: "Risk Assessment and Mitigation Strategy",
          description: "Evaluation of product risks and mitigation plans",
          status: "recommended",
          priority: "medium"
        },
        {
          id: "literature-review",
          title: "Literature Review",
          description: "Relevant scientific literature supporting your development",
          status: "optional",
          priority: "low"
        },
        {
          id: "regulatory-precedent",
          title: "Regulatory Precedent Analysis",
          description: "Analysis of similar products and regulatory decisions",
          status: "recommended",
          priority: "medium"
        }
      ]
    };

    setAiRecommendation(recommendation);
    setShowRecommendation(true);
  };

  const isFormComplete = formData.productType && formData.developmentStage && formData.productName && formData.regulatoryObjective;

  const handleSubmitMeetingRequest = () => {
    // Handle meeting request submission
    console.log('Submitting meeting request:', {
      ...formData,
      aiRecommendation,
      meetingDate
    });
    // Here you would typically make an API call to submit the meeting request
  };

  const handleCreateWithAIWizard = (document: any) => {
    navigate('/agents/document-preparation');
  };

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

      {/* Recommended Documents Section */}
      {showRecommendation && (
        <Card className="mt-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center justify-center">
                <FileText className="w-7 h-7 text-green-500" />
              </span>
              <h2 className="text-xl font-semibold text-gray-900">Recommended Documents</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Documents recommended for your <span className="font-semibold">{aiRecommendation?.recommendedMeetingType || "FDA Meeting"}</span> meeting
            </p>

            {/* Document List */}
            <div className="space-y-4">
              {aiRecommendation?.recommendedDocuments?.map((document: any, index: number) => (
                <div key={document.id} className={`flex items-center justify-between py-4 ${index < aiRecommendation.recommendedDocuments.length - 1 ? 'border-b border-gray-200' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${document.status === 'completed' ? 'bg-green-500' :
                        document.status === 'required' ? 'bg-red-500' :
                          document.status === 'recommended' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}>
                      {document.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{document.title}</h4>
                      <p className="text-sm text-gray-600">{document.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-2"
                      onClick={() => handleCreateWithAIWizard(document)}
                    >
                      <Wand2 className="w-4 h-4" />
                      Create with AI Wizard
                    </Button>
                    <div className="flex items-center gap-1 text-gray-500 cursor-pointer">
                      <span className="text-sm">Need Help?</span>
                      <HelpCircle className="w-4 h-4" />
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* General Submission Tips */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div
                className="space-y-3 p-6 rounded-xl"
                style={{
                  background: "linear-gradient(90deg, #f8fafc 0%, #e0e7ff 100%)",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 8px 0 rgba(16,30,54,0.04)",
                }}
              >
                <h3 className="font-semibold text-gray-900 mb-3">General Submission Tips:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 mt-2 bg-gray-400 rounded-full"></span>
                    <span>Submit documents at least 30 days before your requested meeting date</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 mt-2 bg-gray-400 rounded-full"></span>
                    <span>Use clear, concise language and avoid unnecessary jargon</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 mt-2 bg-gray-400 rounded-full"></span>
                    <span>Include page numbers and a table of contents for longer documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 mt-2 bg-gray-400 rounded-full"></span>
                    <span>Provide electronic copies in searchable PDF format</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 mt-2 bg-gray-400 rounded-full"></span>
                    <span>Consider FDA's current workload and plan accordingly</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Meeting Details Section */}
      {showRecommendation && (
        <Card className="mt-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Meeting Details</h2>

            {/* Meeting Information Card */}
            <div className="w-full bg-blue-50 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{aiRecommendation?.icon || "M"}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{aiRecommendation?.recommendedMeetingType || "FDA Meeting"}</h3>
                  <p className="text-sm text-gray-600">{aiRecommendation?.subtitle || "Meeting to discuss regulatory objectives"}</p>
                </div>
              </div>
            </div>

            {/* Meeting Date Input */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <label htmlFor="meetingDate" className="block text-sm font-medium text-gray-700">
                  Preferred Meeting Date:
                </label>
                <input
                  type="date"
                  id="meetingDate"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b0080] focus:border-[#0b0080]"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  className={`flex items-center gap-2 ${!meetingDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleSubmitMeetingRequest}
                  disabled={!meetingDate}
                >
                  <Calendar className="w-5 h-5" />
                  Submit Meeting Request
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FdaMeetingPrepAgent; 