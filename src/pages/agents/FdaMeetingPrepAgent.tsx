import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Plus, FileText, Clock, Target, Info } from "lucide-react";
import ReusableModal from "../../components/ui/Modal";

interface MeetingRequest {
  id: string;
  title: string;
  type: string;
  status: "pending" | "scheduled" | "completed";
  date?: string;
  time?: string;
  productType?: string;
  developmentStage?: string;
  productName?: string;
  regulatoryObjective?: string;
}

const FdaMeetingPrepAgent = () => {
  const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>([]);
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<MeetingRequest>>({});

  const handleInputChange = (field: keyof MeetingRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const actionCards = [
    {
      title: "Start New Request",
      description: "Begin meeting type identification",
      icon: Plus,
      iconBgColor: "bg-purple-500",
      iconColor: "text-white",
      action: "start",
    },
    {
      title: "Generate Package",
      description: "Create briefing documents",
      icon: FileText,
      iconBgColor: "bg-blue-500",
      iconColor: "text-white",
      action: "generate",
    },
    {
      title: "Practice Q&A",
      description: "Simulate FDA interactions",
      icon: Target,
      iconBgColor: "bg-orange-500",
      iconColor: "text-white",
      action: "practice",
    },
    {
      title: "Track Timeline",
      description: "Monitor deadlines",
      icon: Clock,
      iconBgColor: "bg-green-500",
      iconColor: "text-white",
      action: "track",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[#0b0080] mb-2">FDA Meeting Preparation</h1>
            <p className="text-gray-600">Streamline your FDA meeting process with AI-powered assistance</p>
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={() => setIsNewMeetingModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
            New Meeting Request
          </Button>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {actionCards.map((card) => (
            <Card key={card.title} className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-12 h-12 ${card.iconBgColor} rounded-lg flex items-center justify-center`}>
                    <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Meeting Requests Section */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                  Recent Meeting Requests
                </CardTitle>
                <p className="text-gray-600">
                  Track and manage your FDA meeting submissions
                </p>
              </div>
              <div className="p-3">
                <FileText className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {meetingRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No meeting requests yet</h3>
                <p className="text-gray-500 mb-4">Create your first request to get started</p>
                <Button onClick={() => setIsNewMeetingModalOpen(true)}>
                  Create Your First Request
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Meeting requests will be listed here */}
              </div>
            )}
          </CardContent>
        </Card>

        {/* New Meeting Request Modal */}
        <ReusableModal
          isOpen={isNewMeetingModalOpen}
          onClose={() => setIsNewMeetingModalOpen(false)}
          title="New Meeting Request"
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-medium text-gray-900">
              <Info className="w-5 h-5" />
              <h3>Product Information</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Type
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b0080] focus:border-[#0b0080]"
                    value={formData.productType || ''}
                    onChange={(e) => handleInputChange('productType', e.target.value)}
                  >
                    <option value="">Select product type...</option>
                    <option value="type1">Type 1</option>
                    <option value="type2">Type 2</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Development Stage
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b0080] focus:border-[#0b0080]"
                    value={formData.developmentStage || ''}
                    onChange={(e) => handleInputChange('developmentStage', e.target.value)}
                  >
                    <option value="">Select development stage...</option>
                    <option value="type1">Preclinical</option>
                    <option value="type2">Phase 1</option>
                    <option value="type2">Phase 2</option>
                    <option value="type2">Phase 3</option>
                    <option value="type2">Pre-market</option>
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
                  value={formData.productName || ''}
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
                  value={formData.regulatoryObjective || ''}
                  onChange={(e) => handleInputChange('regulatoryObjective', e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsNewMeetingModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Handle form submission
                  console.log(formData);
                  setIsNewMeetingModalOpen(false);
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        </ReusableModal>
      </div>
    </div>
  );
};

export default FdaMeetingPrepAgent; 