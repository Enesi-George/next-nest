"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useUsers,
  useCreateUser,
  useDeleteUser,
} from "../../../hooks/useUsers";
import { useProfile } from "../../../hooks/useAuth";

export default function UserManagement() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isAdmin: true,
  });
  const [isClient, setIsClient] = useState(false);

  const { data: users, isLoading, error } = useUsers();
  const { data: currentUser } = useProfile();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !localStorage.getItem("token")) {
      router.push("/admin");
    }
  }, [isClient, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createUser.mutate(formData, {
      onSuccess: () => {
        setFormData({ email: "", password: "", isAdmin: true });
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDeleteUser = (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }
    deleteUser.mutate(userId);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create and manage admin users
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create User Form */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Create New User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAdmin"
                  name="isAdmin"
                  checked={formData.isAdmin}
                  onChange={handleChange}
                  className="h-4 w-4 accent-purple-600"
                />
                <label
                  htmlFor="isAdmin"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Admin User
                </label>
              </div>

              <button
                type="submit"
                disabled={createUser.isPending}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {createUser.isPending ? "Creating User..." : "Create User"}
              </button>
            </form>
          </div>

          {/* Users List */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Existing Users</h2>
            <div className="space-y-4">
              {users?.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      {user.isAdmin ? "Admin" : "User"} • Created{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={
                      user.email === "admin@example.com" ||
                      user.id === currentUser?.id
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {users?.length === 0 && (
                <p className="text-center text-gray-500 py-4">No users found</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="text-purple-600 hover:text-purple-500"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
