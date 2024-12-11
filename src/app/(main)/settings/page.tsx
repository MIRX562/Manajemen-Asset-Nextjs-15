"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Clock,
  FileText,
  LogOut,
  Settings,
  User,
  Edit,
  Save,
  Key,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function UserProfileBento() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: "johndoe",
    role: "INVENTARIS",
    email: "john.doe@example.com",
    createdAt: "2023-01-01",
    updatedAt: "2024-03-15",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Header Section */}
        <Card className="col-span-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="flex justify-between items-center p-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">User Profile</h1>
              <p className="text-xl">{userData.username}</p>
              <Badge variant="secondary" className="mt-2">
                {userData.role}
              </Badge>
            </div>
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage
                src="/placeholder-avatar.jpg"
                alt={userData.username}
              />
              <AvatarFallback>
                {userData.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </CardContent>
        </Card>

        {/* User Details Section */}
        <Card className="col-span-full md:col-span-2 lg:col-span-2 row-span-2">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>User Details</span>
              {isEditing ? (
                <Button onClick={handleSave} size="sm">
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              ) : (
                <Button onClick={handleEdit} size="sm">
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <Input
                    type="text"
                    name="username"
                    id="username"
                    value={userData.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={userData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password Reset Section */}
        <Card className="col-span-full md:col-span-2 lg:col-span-2 row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="mr-2" /> Password Reset
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="current-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Password
                </label>
                <Input
                  type="password"
                  name="current"
                  id="current-password"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <Input
                  type="password"
                  name="new"
                  id="new-password"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  name="confirm"
                  id="confirm-password"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  className="mt-1"
                />
              </div>
              <Button className="w-full">Reset Password</Button>
            </form>
          </CardContent>
        </Card>

        {/* Timestamps */}
        <Card className="col-span-full md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2" /> Timestamps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Created: {userData.createdAt}</p>
            <p className="text-sm">Updated: {userData.updatedAt}</p>
          </CardContent>
        </Card>

        {/* Activity Logs */}
        <Card className="col-span-full md:col-span-1 lg:col-span-2 row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2" /> Activity Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="bg-gray-100 p-2 rounded">
                DELETE - MAINTENANCE - 17 - 2024-12-09 20:57:57
              </li>
              <li className="bg-gray-100 p-2 rounded">
                UPDATE - ASSET - 23 - 2024-12-08 15:30:22
              </li>
              <li className="bg-gray-100 p-2 rounded">
                CREATE - USER - 5 - 2024-12-07 09:15:43
              </li>
            </ul>
            <Button variant="link" className="mt-4">
              View All Logs
            </Button>
          </CardContent>
        </Card>

        {/* Maintenances */}
        <Card className="col-span-full md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2" /> Maintenances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between items-center bg-yellow-100 p-2 rounded">
                <span>ID: 45</span>
                <span>2024-12-15</span>
                <span className="bg-yellow-200 px-2 py-1 rounded">Pending</span>
              </li>
              <li className="flex justify-between items-center bg-green-100 p-2 rounded">
                <span>ID: 39</span>
                <span>2024-12-10</span>
                <span className="bg-green-200 px-2 py-1 rounded">
                  Completed
                </span>
              </li>
            </ul>
            <Button variant="link" className="mt-4">
              Manage Maintenances
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="col-span-full md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="bg-blue-100 p-2 rounded">
                New asset assigned - Asset ID: 78
              </li>
              <li className="bg-blue-100 p-2 rounded">
                Maintenance request - ID: 45
              </li>
            </ul>
            <div className="flex justify-between items-center mt-4">
              <Button variant="link">View All</Button>
              <Button variant="outline" size="sm">
                Mark All as Read
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sessions */}
        <Card className="col-span-full md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2" /> Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between items-center bg-purple-100 p-2 rounded">
                <span>ID: 1234</span>
                <span>Expires: 2024-12-15 14:30</span>
              </li>
              <li className="flex justify-between items-center bg-purple-100 p-2 rounded">
                <span>ID: 1233</span>
                <span>Expires: 2024-12-14 09:45</span>
              </li>
            </ul>
            <Button variant="link" className="mt-4">
              Manage Sessions
            </Button>
          </CardContent>
        </Card>

        {/* Check-In/Out Records */}
        <Card className="col-span-full md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LogOut className="mr-2" /> Check-In/Out Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="grid grid-cols-3 gap-2 bg-gray-100 p-2 rounded">
                <span>Asset ID: 45</span>
                <span>Out: 2024-12-09</span>
                <span>In: 2024-12-10</span>
              </li>
              <li className="grid grid-cols-3 gap-2 bg-gray-100 p-2 rounded">
                <span>Asset ID: 23</span>
                <span>Out: 2024-12-07</span>
                <span>In: 2024-12-08</span>
              </li>
            </ul>
            <Button variant="link" className="mt-4">
              View All Records
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
