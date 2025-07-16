import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Plus, Activity, Calendar, FileText, Info, Lightbulb } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import ReusableModal from "../../components/ui/Modal";

const FdaMeetingPrepAgent = () => {
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    productType: '',
    developmentStage: '',
    productName: '',
    regulatoryObjective: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGetAIRecommendation = () => {
    // Handle AI recommendation logic here
    console.log('Form data:', formData);
    setIsNewMeetingModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
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

      {/* New Meeting Request Modal */}
      <ReusableModal
        isOpen={isNewMeetingModalOpen}
        onClose={() => setIsNewMeetingModalOpen(false)}
        title="Product Information"
        maxWidth="max-w-3xl"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-lg font-medium text-gray-900">
            <Info className="w-5 h-5 text-blue-500" />
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

          <div className="flex justify-center pt-4">
            <Button
              className="flex items-center gap-2"
              onClick={handleGetAIRecommendation}
            >
              <Lightbulb className="w-5 h-5" />
              Get AI Recommendation
            </Button>
          </div>
        </div>
      </ReusableModal>
    </div>
  );
};

export default FdaMeetingPrepAgent; 