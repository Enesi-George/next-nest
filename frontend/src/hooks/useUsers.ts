import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { showToast } from '@/lib/toast';

export interface User {
  id: number;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  isAdmin: boolean;
}

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  details: (id: number) => [...userKeys.all, 'detail', id] as const,
};

// Queries
export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: async (): Promise<User[]> => {
      const { data } = await api.get('/users');
      return data;
    },
  });
};

export const useUser = (id: number) => {
  return useQuery({
    queryKey: userKeys.details(id),
    queryFn: async (): Promise<User> => {
      const { data } = await api.get(`/users/${id}`);
      return data;
    },
  });
};


export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUserDto): Promise<User> => {
      const { data } = await api.post('/users', userData);
      return data;
    },
    onSuccess: () => {
      showToast.success('User created successfully!');
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create user';
      showToast.error(message);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number): Promise<void> => {
      await api.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      showToast.success('User deleted successfully!');
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete user';
      showToast.error(message);
    },
  });
};