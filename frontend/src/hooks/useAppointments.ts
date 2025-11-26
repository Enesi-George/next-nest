import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { showToast } from '@/lib/toast';
import { useEffect, useState } from 'react';

export interface Appointment {
  id: number;
  name: string;
  email: string;
  appointmentDateTime: string;
  notes: string;
  googleEventId: string;
  createdAt: string;
}

export interface CreateAppointmentDto {
  name: string;
  email: string;
  appointmentDateTime: string;
  notes?: string;
}

export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  details: (id: number) => [...appointmentKeys.all, 'detail', id] as const,
};

export const useAppointments = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return useQuery({
    queryKey: appointmentKeys.lists(),
    queryFn: async (): Promise<Appointment[]> => {
      const { data } = await api.get('/appointments');
      return data;
    },
    enabled: isClient && !!localStorage.getItem('token'),
  });
};

export const useAppointment = (id: number) => {
  return useQuery({
    queryKey: appointmentKeys.details(id),
    queryFn: async (): Promise<Appointment> => {
      const { data } = await api.get(`/appointments/${id}`);
      return data;
    },
    enabled: !!id && !!localStorage.getItem('token'),
  });
};

// Mutations
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentData: CreateAppointmentDto): Promise<Appointment> => {
      const { data } = await api.post('/appointments', appointmentData);
      return data;
    },
    onSuccess: () => {
      showToast.success('Appointment booked successfully!');
      // Invalidate and refetch appointments list for admin users
      if (localStorage.getItem('token')) {
        queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to book appointment';
      showToast.error(message);
    },
  });
};