import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Search, ExternalLink, CheckCircle, Lightbulb } from "lucide-react";

export function PredicateMatching({ predicateMatches, isLoading }: any) {
  const handlePredicateSelect = (
    _predicateId: number,
    _isSelected: boolean
  ) => {
    // setPredicateMatches((prev) =>
    //   prev.map((match) =>
    //     match.id === predicateId ? { ...match, isSelected } : match
    //   )
    // );
  };

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case "primary":
        return "bg-teal-100 text-teal-800";
      case "secondary":
        return "bg-blue-100 text-blue-800";
      case "alternative":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMatchTypeLabel = (matchType: string) => {
    switch (matchType) {
      case "primary":
        return "Primary Match";
      case "secondary":
        return "Secondary Match";
      case "alternative":
        return "Alternative Match";
      default:
        return "Match";
    }
  };

  if (isLoading) {
    return (
      <Card className="healthcare-card">
        <CardHeader>
          <CardTitle>Predicate Device Matching</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-16 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="healthcare-card healthcare-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
              Predicate Device Matching
            </CardTitle>
            <p className="text-gray-600">
              AI-powered matching to find the most relevant predicate devices
            </p>
          </div>
          <div className="bg-teal-50 p-3 rounded-lg">
            <Search className="h-6 w-6 text-teal-600" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {predicateMatches && predicateMatches.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {predicateMatches.map((match: any) => (
                <div
                  key={match.id}
                  className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                    match.isSelected
                      ? "border-teal-300 bg-teal-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={getMatchTypeColor(match.matchType)}>
                      {getMatchTypeLabel(match.matchType)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {match.similarity}% similarity
                    </span>
                  </div>

                  <h4 className="font-medium text-gray-900 mb-2">
                    {match.deviceName}
                  </h4>

                  <p className="text-sm text-gray-600 mb-3">
                    <strong>K-Number:</strong>{" "}
                    <a
                      target="_blank"
                      href={`https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=${match.kNumber}`}
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      {match.kNumber}
                      <ExternalLink className="h-3 w-3 inline ml-1" />
                    </a>
                  </p>

                  <p className="text-sm text-gray-600 mb-4">{match.summary}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Approved: {match.approvalDate}
                    </span>
                    <Button
                      size="sm"
                      variant={match.isSelected ? "default" : "outline"}
                      onClick={() =>
                        handlePredicateSelect(match.id, !match.isSelected)
                      }
                      className={
                        match.isSelected
                          ? "bg-teal-600 hover:bg-teal-700 text-white"
                          : "hover:bg-gray-50"
                      }
                    >
                      {match.isSelected ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Selected
                        </>
                      ) : (
                        "Select Predicate"
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">AI Insight</h4>
                  <p className="text-blue-700">
                    The{" "}
                    {
                      predicateMatches.find(
                        (m: any) => m.matchType === "primary"
                      )?.deviceName
                    }{" "}
                    shows the strongest technological similarity to your device.
                    Consider reviewing their predicate comparison table and
                    testing approach for insights into your submission strategy.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Predicate Matches Found
            </h3>
            <p className="text-gray-600 mb-4">
              No similar devices were found in the FDA database. This may
              indicate a novel device requiring De Novo classification.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-700">
                <strong>AI Suggestion:</strong> Consider De Novo pathway due to
                device novelty. This pathway is designed for novel devices that
                don't have suitable predicate devices.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
