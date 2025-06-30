import {
  ArrowUp,
  Badge,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  Shield,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import Progress from "../components/ui/Progress";

const Dashboard = () => {
  const stats = {
    activeSubmissions: 12,
    pendingReview: 5,
    approved: 8,
    approvalRate: 66,
  };

  const submissions = [
    {
      id: 1,
      deviceName: "CardioSense Monitor",
      kNumber: "K230001",
      deviceType: "Cardiac Monitor",
      status: "approved",
      progress: 100,
      updatedAt: "2024-06-01T10:30:00Z",
    },
    {
      id: 2,
      deviceName: "ThermoScan Pro",
      kNumber: "K230002",
      deviceType: "Thermometer",
      status: "pending",
      progress: 80,
      updatedAt: "2024-06-02T14:45:00Z",
    },
    {
      id: 3,
      deviceName: "PulseOx 2000",
      kNumber: "",
      deviceType: "Pulse Oximeter",
      status: "draft",
      progress: 40,
      updatedAt: "2024-06-03T09:20:00Z",
    },
    {
      id: 4,
      deviceName: "GlucoTrack",
      kNumber: "K230004",
      deviceType: "Glucose Meter",
      status: "approved",
      progress: 100,
      updatedAt: "2024-05-28T16:10:00Z",
    },
    {
      id: 5,
      deviceName: "RespiraFlow",
      kNumber: "",
      deviceType: "Spirometer",
      status: "pending",
      progress: 60,
      updatedAt: "2024-06-04T11:05:00Z",
    },
  ];

  const handleDeleteSubmission = (id: number) => {
    // Logic to delete submission
    console.log(`Deleting submission with id: ${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-blue-100 text-blue-800";
      case "under_review":
        return "bg-orange-100 text-orange-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "under_review":
        return "Under Review";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };
  return (
    <div className="space-y-8 flex flex-col flex-1 p-6 min-h-screen bg-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
          <p className="text-gray-700 mt-1">
            Manage your 510(k) submissions and compliance documentation
          </p>
        </div>
        <a href="/form-builder">
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-[#2094f3] hover:bg-blue-800 text-white font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 mr-2"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            New 510(k) Submission
          </button>
        </a>
      </div>
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Active Submissions
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.activeSubmissions || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            {/* <p className="text-sm text-green-600 mt-2 flex items-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                +2 this month
              </p> */}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Pending Review
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.pendingReview || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            {/* <p className="text-sm text-gray-700 mt-2">Avg 14 days</p> */}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Approved</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.approved || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            {/* <p className="text-sm text-green-600 mt-2">
                {stats?.approvalRate || 0}% success rate
              </p> */}
          </CardContent>
        </Card>

        {/* <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Compliance Score
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">98%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">Excellent</p>
            </CardContent>
          </Card> */}
      </div>

      {/* Recent Submissions Table */}
      <Card>
        <div className="px-6 py-4 border-b border-ms-gray-300">
          <h3 className="text-lg font-medium text-ms-gray-900">
            Recent Submissions
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-ms-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-ms-gray-700 uppercase tracking-wider">
                  Device Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ms-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ms-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ms-gray-700 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ms-gray-700 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ms-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-ms-gray-300">
              {submissions.map((submission: any) => (
                <tr key={submission.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-ms-gray-900">
                      {submission.deviceName}
                    </div>
                    <div className="text-sm text-ms-gray-700">
                      {submission.kNumber ||
                        `K${String(submission.id).padStart(9, "0")}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ms-gray-700">
                    {submission.deviceType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusColor(submission.status)}>
                      {getStatusText(submission.status)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full">
                      <Progress value={submission.progress} className="h-2" />
                      <span className="text-xs text-ms-gray-700 mt-1 block">
                        {submission.progress}% Complete
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ms-gray-700">
                    {new Date(submission.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <Link to={`/form-builder/${submission.id}`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4 ms-blue" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4 text-ms-gray-700" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="w-4 h-4 text-ms-gray-700" />
                    </Button>
                    {submission.status === "draft" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSubmission(submission.id)}
                      >
                        <Trash2 className="w-4 h-4 ms-red" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
