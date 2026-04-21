import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export const api = axios.create({ baseURL: API_BASE_URL });

export async function fetchSongs() {
  const res = await api.get("/garcia/songs");
  return res.data;
}

export async function searchSongs(key) {
  const res = await api.get(`/garcia/songs/search/${encodeURIComponent(key)}`);
  return res.data;
}

export async function fetchSong(id) {
  const res = await api.get(`/garcia/songs/${id}`);
  return res.data;
}