import { useState, useEffect } from "react";
import { Route, Sparkles, Info, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/Card";
import { Button } from "./ui/Button";
import Input from "./Input";
import { Badge } from "./ui/Badge";

interface PathwayRecommendationProps {
  submissionId: number;
}

interface RecommendationResponse {
  pathway: string;
  confidence: number;
  timeline: string;
  explanation: string;
}

// Temporary mock data for demonstration
const mockSubmission = {
  productType: "Medical Device",
  riskClassification: "Class II",
  intendedUse: "Example intended use",
  technologicalCharacteristics: "Example characteristics",
  predicateDevice: "K123456",
};

export function PathwayRecommendation({
  submissionId,
}: PathwayRecommendationProps) {
  const [formData, setFormData] = useState({
    productType: "",
    riskClassification: "",
    intendedUse: "",
    technologicalCharacteristics: "",
    predicateDevice: "",
  });

  const [recommendation, setRecommendation] =
    useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulating data fetch
    setFormData(mockSubmission);
  }, [submissionId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulating API call
    setTimeout(() => {
      setRecommendation({
        pathway: "510(k)",
        confidence: 95,
        timeline: "3-6 months",
        explanation:
          "Based on your inputs, a 510(k) submission is recommended due to the device classification and technological characteristics.",
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="border-2 border-purple-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Pathway Recommendation
            </h3>
            <p className="text-gray-600">
              Answer a few questions to get your personalized FDA submission
              pathway
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <Route className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                label="Product Type *"
                value={formData.productType}
                onChange={
                  ((e: any) =>
                    handleInputChange("productType", e.target.value)) as any
                }
                placeholder="Enter product type"
                required
              />

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Risk Classification *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Class I", "Class II", "Class III"].map(
                    (classification) => (
                      <Button
                        key={classification}
                        type="button"
                        variant={
                          formData.riskClassification === classification
                            ? "default"
                            : "outline"
                        }
                        className={`text-sm ${
                          formData.riskClassification === classification
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() =>
                          handleInputChange(
                            "riskClassification",
                            classification
                          )
                        }
                      >
                        {classification}
                      </Button>
                    )
                  )}
                </div>
              </div>

              <Input
                label="Predicate Device (Optional)"
                value={formData.predicateDevice}
                onChange={(e) =>
                  handleInputChange("predicateDevice", e.target.value)
                }
                placeholder="Enter K-number or device name"
              />
            </div>

            <div className="space-y-4">
              <Input
                label="Intended Use *"
                value={formData.intendedUse}
                onChange={(e) =>
                  handleInputChange("intendedUse", e.target.value)
                }
                placeholder="Describe the intended use of your device..."
                textarea
                required
              />

              <Input
                label="Technological Characteristics *"
                value={formData.technologicalCharacteristics}
                onChange={(e) =>
                  handleInputChange(
                    "technologicalCharacteristics",
                    e.target.value
                  )
                }
                placeholder="Describe key technological features..."
                textarea
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Info className="h-4 w-4" />
              <span>AI analysis typically takes 2-3 seconds</span>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isLoading ? "Analyzing..." : "Get AI Recommendation"}
            </Button>
          </div>
        </form>

        {recommendation && (
          <div className="mt-6 bg-teal-50 border border-teal-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-teal-100 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-teal-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-teal-900 mb-2">
                  AI Recommendation: {recommendation.pathway}
                </h4>
                <p className="text-teal-700 mb-3">
                  {recommendation.explanation}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <Badge
                    variant="secondary"
                    className="bg-teal-100 text-teal-800"
                  >
                    Confidence: {recommendation.confidence}%
                  </Badge>
                  <span className="text-teal-600">•</span>
                  <span className="text-teal-600">
                    Estimated Timeline: {recommendation.timeline}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
