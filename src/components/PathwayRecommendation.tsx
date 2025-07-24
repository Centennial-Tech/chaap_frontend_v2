import { useState, useEffect } from "react";
import { Route, Sparkles, Info, CheckCircle, Plus, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/Card";
import { Button } from "./ui/Button";
import Input from "./Input";
import { Badge } from "./ui";
import { useSubmission } from "../provider/submissionProvider";
import { productTypes } from "../constants";
import { useNavigate } from "react-router-dom";
// Temporary mock data for demonstration - removed unused variable

export function PathwayRecommendation({
  recommendation,
  isLoading = false,
  callback = () => {},
}: any) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productType: "",
    riskClassification: "Class II",
    intendedUse: "",
    technologicalCharacteristics: "",
    predicateDevice: "",
  });

  const { 
    activeSubmission, 
    submissions, 
    setActiveSubmission, 
    createNewSubmission 
  } = useSubmission();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const isMedicalDevice = formData.productType === "medical device";

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
              <div className="grid grid-cols-2 gap-4">
                {/* Submission Selector */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Submission Name
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center justify-between w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 text-sm focus:border-purple-500 focus:ring-purple-500"
                    >
                      <span className="truncate">{activeSubmission?.name || "Select submission"}</span>
                      <ChevronDown
                        className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform duration-200 ${
                          isDropdownOpen ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-1 bg-white rounded-md border border-gray-300 py-1 z-50 shadow-sm">
                        <button
                          type="button"
                          onClick={() => {
                            createNewSubmission();
                            setIsDropdownOpen(false);
                            navigate("/dashboard?openNewSubmission=true");
                          }}
                          className="w-full text-left px-3 py-1.5 text-sm text-blue-600 hover:bg-gray-50 transition-colors duration-200 font-medium flex items-center space-x-2 border-b border-gray-200"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Create New</span>
                        </button>

                        {submissions?.length > 0 ? (
                          submissions.map((submission) => (
                            <button
                              type="button"
                              key={submission.id}
                              onClick={() => {
                                setActiveSubmission(submission);
                                setIsDropdownOpen(false);
                              }}
                              className={`
                                w-full text-left px-3 py-1.5 text-sm
                                ${activeSubmission?.id === submission.id
                                  ? "bg-gray-50 text-gray-900"
                                  : "text-gray-700 hover:bg-gray-50"
                                }
                                transition-colors duration-200
                              `}
                            >
                              <div className="font-medium truncate">{submission.name}</div>
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-1.5 text-sm text-gray-500">
                            No submissions
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Type */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Product Type
                  </label>
                  <select
                    value={formData.productType}
                    onChange={(e) =>
                      handleInputChange("productType", e.target.value)
                    }
                    required
                    disabled={!!activeSubmission}
                    className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:ring-purple-500 text-sm ${
                      activeSubmission ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select product type
                    </option>
                    {productTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {isMedicalDevice && (
                <>
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
                        handleInputChange(
                          "predicateDevice",
                          e.target.value
                        )) as any
                    }
                    placeholder="Enter K-number or device name"
                    value={formData.predicateDevice}
                  />
                </>
              )}
            </div>

            <div className="space-y-4">
              <Input
                label="Intended Use"
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
