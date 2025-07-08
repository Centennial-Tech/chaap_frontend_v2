import { useAuth } from "../provider/authProvider";
import { Card } from "../components/ui/Card";
import { useState } from "react";
import { Button } from "@mui/material";

const UserProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">User Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              <p className="text-sm text-gray-500">Your personal details</p>
            </div>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsEditing(!isEditing)}
              className="!text-sm"
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.first_name && user.last_name
                  ? `${user.first_name[0]}${user.last_name[0]}`
                  : user.username?.[0]?.toUpperCase() || "U"}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">First Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={user.first_name || ""}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Last Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={user.last_name || ""}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={user.email || ""}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={user.phone_number || ""}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Organization Details</h2>
          <p className="text-sm text-gray-500 mb-6">Your organization information</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Organization Name</label>
              <input
                type="text"
                disabled={!isEditing}
                value={user.organization_name || ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Organization ID</label>
              <input
                type="text"
                disabled
                value={user.organization_Id || ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
