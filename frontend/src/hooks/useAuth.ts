import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { showToast } from '@/lib/toast';
import { useEffect, useState } from 'react';

export interface User {
  id: number;
  email: string;
  isAdmin: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

export const useProfile = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async (): Promise<User> => {
      const { data } = await api.get('/auth/profile');
      return data;
    },
    enabled: isClient && !!localStorage.getItem('token'),
    retry: false,
  });
};

// Mutations
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const { data } = await api.post('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      showToast.success(`Welcome back, ${data.user.email}!`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed';
      showToast.error(message);
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    onSuccess: () => {
      showToast.info('Logged out successfully');
    },
  });
};

