type RequestOptions = {
  credentials?: RequestCredentials;
};

async function request(url: string, method = "GET", body?: BodyInit | object, options: RequestOptions = {}) {
  const isFormData = body instanceof FormData;
  const response = await fetch(url, {
    method,
    credentials: options.credentials,
    headers: body && !isFormData ? { "Content-Type": "application/json" } : undefined,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(data?.error || `Request failed with status ${response.status}`) as Error & {
      response?: { data: unknown; status: number };
    };
    error.response = { data, status: response.status };
    throw error;
  }

  return { data };
}

export const api = {
  get: (url: string, options?: RequestOptions) => request(url, "GET", undefined, options),
  post: (url: string, body?: BodyInit | object, options?: RequestOptions) => request(url, "POST", body, options),
  put: (url: string, body?: BodyInit | object, options?: RequestOptions) => request(url, "PUT", body, options),
  delete: (url: string, options?: RequestOptions) => request(url, "DELETE", undefined, options),
};
