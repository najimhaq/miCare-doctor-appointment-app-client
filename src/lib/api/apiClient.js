// frontend - lib/apiClient.js
//Server‑side (Next.js API routes, SSR) → apiClient বা সরাসরি axiosInstance ব্যবহার করো।
//👉 অর্থাৎ server‑side এ useApi নয়, বরং axiosInstance বা apiClient ব্যবহার করাই সঠিক।
//যদি তোমার project এ axios dependency আগে থেকেই থাকে → axiosInstance ব্যবহার করো।
// যদি dependency কম রাখতে চাও → apiClient ব্যবহার করো।

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';


async function request(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;

  const config = {
    method: options.method || 'GET',
    credentials: 'include',
    headers: isFormData
      ? { ...options.headers }
      : { 'Content-Type': 'application/json', ...options.headers },
    body: isFormData
      ? options.body
      : options.body
        ? JSON.stringify(options.body)
        : undefined,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, config);

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(
      data?.message || `Request failed with status ${res.status}`
    );
  }

  return data;
}

export const apiClient = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'POST', body }),
  patch: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options) =>
    request(endpoint, { ...options, method: 'DELETE' }),
};
