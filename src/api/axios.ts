import axios from "axios";
import { getCached, setCached } from "../utils/cache";

// Default to PokeAPI (easy, no key). Replace baseURL anytime.
const baseURL = process.env.REACT_APP_API_BASE ?? "https://pokeapi.co/api/v2";

export const api = axios.create({
  baseURL,
  timeout: 10000,
});

// GET with URL-based cache
export async function getWithCache<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const full = api.getUri({ url, params });
  const cached = getCached<T>(full);
  if (cached) return cached;

  const { data } = await api.get<T>(url, { params });
  setCached(full, data);
  return data;
}
