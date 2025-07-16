import { useState, useEffect } from "react";
import { Route, Sparkles, Info, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/Card";
import { Button } from "./ui/Button";
import Input from "./Input";
import { Badge } from "./ui";
import { useSubmission } from "../provider/submissionProvider";
// Temporary mock data for demonstration - removed unused variable

export function PathwayRecommendation({
  recommendation,
  isLoading = false,
  callback = () => {},
}: any) {
  const [formData, setFormData] = useState({
    productType: "",
    riskClassification: "Class II",
    intendedUse: "",
    technologicalCharacteristics: "",
    predicateDevice: "",
  });

  const { activeSubmission } = useSubmission();

  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      productType: activeSubmission?.product_type,
      intendedUse: activeSubmission?.intended_use,
    }));
  }, [activeSubmission]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    callback(formData);
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
                label="Product Type"
                onChange={
                  ((e: any) =>
                    handleInputChange("productType", e.target.value)) as any
                }
                placeholder="Enter product type"
                required
                value={formData.productType}
              />

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Risk Classification
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
                onChange={
                  ((e: any) =>
                    handleInputChange("predicateDevice", e.target.value)) as any
                }
                placeholder="Enter K-number or device name"
                value={formData.predicateDevice}
              />
            </div>

            <div className="space-y-4">
              <Input
                label="Intended Use"
                // value={formData.intendedUse}
                onChange={
                  ((e: any) =>
                    handleInputChange("intendedUse", e.target.value)) as any
                }
                placeholder="Describe the intended use of your device..."
                textarea
                required
                value={formData.intendedUse}
              />

              <Input
                label="Technological Characteristics"
                // value={formData.technologicalCharacteristics as any}
                onChange={
                  ((e: any) =>
                    handleInputChange(
                      "technologicalCharacteristics",
                      e.target.value
                    )) as any
                }
                placeholder="Describe key technological features..."
                textarea
                required
                value={formData.technologicalCharacteristics}
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

        {recommendation && recommendation.pathway && (
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
