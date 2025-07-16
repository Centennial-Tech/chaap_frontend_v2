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
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [meetingRequests, setMeetingRequests] = useState<any[]>([]);
  const [editingSubmissionId, setEditingSubmissionId] = useState<string | null>(null);
  const [openHelpId, setOpenHelpId] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({ productType: '', developmentStage: '', productName: '', regulatoryObjective: '' });
    setAiRecommendation(null);
    setMeetingDate('');
    setShowRecommendation(false);
    setEditingSubmissionId(null);
    setOpenHelpId(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGetAIRecommendation = () => {
    const recommendation = {
      recommendedMeetingType: "End of Phase 2 (EOP2)",
      icon: "E",
      subtitle: "Meeting to discuss Phase 2 results and Phase 3 design",
      matchPercentage: "90%",
      timeline: "4-6 weeks to prepare",
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
          status: "required",
          helpContent: {
            whatToInclude: [
              "A structured letter outlining your request, objectives, and proposed agenda",
              "Clear statement of meeting purpose",
              "Specific questions or topics for discussion",
              "Proposed meeting date and format preference"
            ],
            tips: [
              "Submit 30-75 days before desired meeting date",
              "Include your contact information and preferred FDA attendees",
              "Be specific about what decisions or feedback you need"
            ]
          }
        },
        { 
          id: "product-development-summary", 
          title: "Product Development Summary", 
          description: "Comprehensive overview of your product and development program", 
          status: "required",
          helpContent: {
            whatToInclude: [
              "Product description and intended use",
              "Current development status and milestones",
              "Summary of available data and key findings",
              "Proposed development plan and timeline"
            ],
            tips: [
              "Focus on data that supports your meeting objectives",
              "Highlight any significant safety or efficacy findings",
              "Include relevant regulatory precedents or guidance"
            ]
          }
        },
        { 
          id: "cmc-information", 
          title: "CMC Information Package", 
          description: "Chemistry, Manufacturing, and Controls documentation", 
          status: "recommended",
          helpContent: {
            whatToInclude: [
              "Manufacturing process description and controls",
              "Stability data and specifications",
              "Analytical methods and validation data",
              "Any manufacturing changes and their impact"
            ],
            tips: [
              "Ensure all CMC data is current and complete",
              "Address any CMC-related questions or concerns",
              "Include relevant FDA guidance compliance"
            ]
          }
        },
        { 
          id: "risk-assessment", 
          title: "Risk Assessment and Mitigation Strategy", 
          description: "Evaluation of product risks and mitigation plans", 
          status: "recommended",
          helpContent: {
            whatToInclude: [
              "Identification of potential risks associated with the product",
              "Current risk mitigation strategies and plans",
              "Safety monitoring protocols and procedures",
              "Risk-benefit analysis framework"
            ],
            tips: [
              "Be comprehensive in risk identification",
              "Provide evidence-based mitigation strategies",
              "Address any emerging safety concerns proactively"
            ]
          }
        },
        { 
          id: "literature-review", 
          title: "Literature Review", 
          description: "Relevant scientific literature supporting your development", 
          status: "optional",
          helpContent: {
            whatToInclude: [
              "Relevant published studies and clinical data",
              "Key findings and their relevance to your product",
              "Analysis of conflicting data or controversial findings",
              "Context for your development program"
            ],
            tips: [
              "Focus on recent and relevant literature",
              "Address any conflicting data transparently",
              "Include regulatory decisions on similar products"
            ]
          }
        },
        { 
          id: "regulatory-precedent", 
          title: "Regulatory Precedent Analysis", 
          description: "Analysis of similar products and regulatory decisions", 
          status: "recommended",
          helpContent: {
            whatToInclude: [
              "Analysis of similar products and their regulatory pathways",
              "Relevant FDA decisions and guidance documents",
              "Precedents that support your approach",
              "Lessons learned from similar development programs"
            ],
            tips: [
              "Focus on recent and relevant precedents",
              "Address any differences from precedents and their justification",
              "Include both positive and negative precedents"
            ]
          }
        }
      ]
    };
    setAiRecommendation(recommendation);
    setShowRecommendation(true);
  };

  const handleSubmitMeetingRequest = () => {
    const submissionData = {
      id: editingSubmissionId || Date.now().toString(),
      productName: formData.productName || 'Drug',
      productType: formData.productType,
      meetingType: aiRecommendation?.recommendedMeetingType?.toLowerCase().replace(/\s+/g, '_') || 'end_of_phase1',
      developmentStage: formData.developmentStage,
      submittedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      lastUpdated: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      formData, aiRecommendation, meetingDate
    };

    if (editingSubmissionId) {
      setSubmissions(prev => prev.map(sub => sub.id === editingSubmissionId ? submissionData : sub));
      setMeetingRequests(prev => prev.map(req => req.id === editingSubmissionId ? submissionData : req));
    } else {
      setSubmissions(prev => [submissionData, ...prev.slice(0, 2)]);
      setMeetingRequests(prev => [submissionData, ...prev.slice(0, 0)]);
    }
    
    setCurrentTab('main');
    resetForm();
  };

  const handleViewDetails = (submission: any) => {
    setFormData(submission.formData);
    setAiRecommendation(submission.aiRecommendation);
    setMeetingDate(submission.meetingDate);
    setShowRecommendation(true);
    setCurrentTab('product-info');
    setEditingSubmissionId(submission.id);
  };

  const EmptyState = ({ title, description }: { title: string; description: string }) => (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-3">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
            <FileText className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 mb-4">{description}</p>
        </div>
      </CardContent>
    </Card>
  );

  const SubmissionCard = ({ submission, onViewDetails }: { submission: any; onViewDetails: (submission: any) => void }) => (
    <Card key={submission.id}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">{submission.productName}</h3>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                <CalendarDays className="w-3 h-3" />
                Submitted
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p>Product Type: {submission.productType}</p>
                <p>Meeting Type: {submission.meetingType}</p>
              </div>
              <div>
                <p>Development Stage: {submission.developmentStage}</p>
                <p>{submission.submittedDate ? `Submitted: ${submission.submittedDate}` : `Last Updated: ${submission.lastUpdated}`}</p>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => onViewDetails(submission)} className="ml-4">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (currentTab === 'main') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[#0b0080] mb-2">FDA Meeting Preparation</h1>
            <p className="text-gray-600">Streamline your FDA meeting process with AI-powered assistance</p>
          </div>
          <Button className="flex items-center gap-2" onClick={() => { setCurrentTab('product-info'); resetForm(); }}>
            <Plus className="w-5 h-5" />
            New Meeting Request
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-900">Recent Submissions</h2>
          </div>
          {submissions.length === 0 ? (
            <EmptyState title="No recent submissions" description="Create your first meeting request to get started" />
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} onViewDetails={handleViewDetails} />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">All Meeting Requests</h2>
          </div>
          {meetingRequests.length === 0 ? (
            <EmptyState title="No meeting requests yet" description="Create your first meeting request to get started" />
          ) : (
            <div className="space-y-4">
              {meetingRequests.map((request) => (
                <SubmissionCard key={request.id} submission={request} onViewDetails={handleViewDetails} />
              ))}
            </div>
          )}
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
        <Button variant="outline" className="flex items-center gap-2" onClick={() => { setCurrentTab('main'); resetForm(); }}>
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
                className={`flex items-center gap-2 ${!Object.values(formData).every(Boolean) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleGetAIRecommendation}
                disabled={!Object.values(formData).every(Boolean)}
              >
                <Lightbulb className="w-5 h-5" />
                Get AI Recommendation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showRecommendation && aiRecommendation && (
        <>
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-7 h-7 text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-900">Recommended Meeting Type</h2>
              </div>
              <div className="space-y-6 p-8 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200">
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

          <Card className="mt-8">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-7 h-7 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-900">Recommended Documents</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Documents recommended for your <span className="font-semibold">{aiRecommendation?.recommendedMeetingType || "FDA Meeting"}</span> meeting
              </p>

              <div className="space-y-4">
                {aiRecommendation?.recommendedDocuments?.map((document: any, index: number) => (
                  <div key={document.id} className={`flex items-center justify-between py-4 ${index < aiRecommendation.recommendedDocuments.length - 1 ? 'border-b border-gray-200' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        document.status === 'completed' ? 'bg-green-500' :
                        document.status === 'required' ? 'bg-red-500' :
                        document.status === 'recommended' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}>
                        {document.status === 'completed' ? <CheckCircle className="w-4 h-4 text-white" /> : <AlertCircle className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{document.title}</h4>
                        <p className="text-sm text-gray-600">{document.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-2"
                        onClick={() => navigate('/agents/document-preparation')}
                      >
                        <Wand2 className="w-4 h-4" />
                        Create with AI Wizard
                      </Button>
                      <div className="relative">
                        <div 
                          className="flex items-center gap-1 text-gray-500 cursor-pointer"
                          onClick={() => setOpenHelpId(openHelpId === document.id ? null : document.id)}
                        >
                          <span className="text-sm">Need Help?</span>
                          <HelpCircle className="w-4 h-4" />
                          <ChevronDown className={`w-4 h-4 transition-transform ${openHelpId === document.id ? 'rotate-180' : ''}`} />
                        </div>
                        {openHelpId === document.id && document.helpContent && (
                          <div className="absolute right-0 top-full mt-2 w-80 bg-blue-50 border border-blue-200 rounded-lg shadow-lg p-4 z-10">
                            <div className="mb-3">
                              <h5 className="font-semibold text-blue-900">Need Help?</h5>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <h6 className="font-semibold text-blue-800 mb-2">What to Include:</h6>
                                <ul className="space-y-1">
                                  {document.helpContent.whatToInclude.map((item: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-blue-700">
                                      <span className="inline-block w-1.5 h-1.5 mt-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h6 className="font-semibold text-blue-800 mb-2">Tips:</h6>
                                <ul className="space-y-1">
                                  {document.helpContent.tips.map((item: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-blue-700">
                                      <Lightbulb className="w-3 h-3 text-yellow-500 mt-1 flex-shrink-0" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-3 p-6 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200">
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

          <Card className="mt-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Meeting Details</h2>

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
        </>
      )}
    </div>
  );
};

export default FdaMeetingPrepAgent; 