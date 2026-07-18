// frontend - lib/uploadImage.js

import { apiClient } from "./api/apiClient";



export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const data = await apiClient.post('/api/upload', formData);
  return data.url;
}
