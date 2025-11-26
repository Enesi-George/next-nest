'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from '@/lib/toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
          mutations: {
            onError: (error: any) => {
              // Global error handler for mutations
              const message = error.response?.data?.message || 'Something went wrong';
              showToast.error(message);
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}