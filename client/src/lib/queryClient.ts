import { QueryClient, QueryFunction } from "@tanstack/react-query";

const apiDisabledError = new Error("API calls are disabled in this static build.");

export async function apiRequest(): Promise<Response> {
  throw apiDisabledError;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  () =>
  async () => {
    throw apiDisabledError;
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
