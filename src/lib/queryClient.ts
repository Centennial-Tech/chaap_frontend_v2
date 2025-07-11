export async function apiRequest(
  method: string,
  endpoint: string,
  data?: any
) {
  const baseUrl = import.meta.env.VITE_API_URL || '';
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response;
} 