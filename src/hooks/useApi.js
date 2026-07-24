//Server‑side (Next.js API routes) এবং client‑side দুই জায়গাতেই ব্যবহার করা যায়। • Client‑side (React components) → useApi ব্যবহার করো, কারণ এটা stateful UI এর জন্য বানানো।
// 👉 অর্থাৎ server‑side এ useApi নয়, বরং axiosInstance বা apiClient ব্যবহার করাই সঠিক।

import axiosInstance from '@/lib/api/axiosInstance';
import { useState, useEffect, useCallback } from 'react';

import toast from 'react-hot-toast';


export function useApi(endpoint, options = {}, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!endpoint) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(endpoint, options);
      setData(response.data);
    } catch (err) {
      const message = err.message || 'Failed to fetch data';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, JSON.stringify(options)]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
}
