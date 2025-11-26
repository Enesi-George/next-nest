'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppointments } from '../../../hooks/useAppointments';
import { useProfile, useLogout } from '../../../hooks/useAuth';

export default function AdminDashboard() {
  const [isClient, setIsClient] = useState(false);
  const { data: appointments, isLoading, error } = useAppointments();
  const { data: user } = useProfile();
  const logout = useLogout();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !localStorage.getItem('token')) {
      router.push('/admin');
    }
  }, [isClient, router]);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        router.push('/admin');
      },
    });
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
        <div className="text-xl">Loading appointments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error loading appointments</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
              <span className="text-sm text-gray-500">
                Welcome, {user?.email}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/users')}
                className="text-purple-600 hover:text-purple-500"
              >
                Manage Users
              </button>
              <button
                onClick={handleLogout}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Google Event ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments?.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(appointment.appointmentDateTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {appointment.notes || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.googleEventId || 'Not synced'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {appointments?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No appointments found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}