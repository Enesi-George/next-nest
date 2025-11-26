'use client';
import { useState } from 'react';
import { useCreateAppointment } from '../hooks/useAppointments';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    appointmentDateTime: '',
    notes: '',
  });

  const createAppointment = useCreateAppointment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createAppointment.mutate(formData, {
      onSuccess: () => {
        setFormData({ name: '', email: '', appointmentDateTime: '', notes: '' });
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Book an Appointment
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="appointmentDateTime" className="block text-sm font-medium text-gray-700">
              Preferred Date & Time
            </label>
            <input
              type="datetime-local"
              id="appointmentDateTime"
              name="appointmentDateTime"
              required
              value={formData.appointmentDateTime}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <button
            type="submit"
            disabled={createAppointment.isPending}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {createAppointment.isPending ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/admin" className="text-purple-600 hover:text-purple-500">
            Admin Login
          </a>
        </div>
      </div>
    </div>
  );
}