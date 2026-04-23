import { useEffect, useMemo, useState } from "react";
import { Alert, Chip, Skeleton, Typography } from "@mui/material";
import { fetchSongs, searchSongs } from "../api.js";
import SongCard from "../components/SongCard.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const category = (params.get("cat") ?? "all").trim().toLowerCase();

  const [result, setResult] = useState({ songs: [], error: "", query: null });

  const title = useMemo(() => (q ? `Results for "${q}"` : "Home"), [q]);
  const categories = useMemo(() => {
    const set = new Set();
    for (const song of result.songs) {
      if (song.genre && String(song.genre).trim()) {
        set.add(String(song.genre).trim());
      }
    }
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [result.songs]);

  const filteredSongs = useMemo(() => {
    if (category === "all") return result.songs;
    return result.songs.filter(
      (song) => String(song.genre ?? "").trim().toLowerCase() === category
    );
  }, [result.songs, category]);

  function changeCategory(nextCategory) {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (nextCategory !== "all") next.set("cat", nextCategory);
    const qs = next.toString();
    navigate(qs ? `/?${qs}` : "/");
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = q ? await searchSongs(q) : await fetchSongs();
        if (!cancelled) setResult({ songs: data, error: "", query: q });
      } catch (e) {
        if (!cancelled) {
          setResult({ songs: [], error: e?.message ?? "Failed to load songs", query: q });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [q]);

  const loading = result.query !== q;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <Skeleton variant="text" width={220} height={44} />
          <Skeleton variant="rounded" width={80} height={26} />
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton variant="rounded" className="!h-auto !rounded-2xl">
                <div className="aspect-video w-full" />
              </Skeleton>
              <Skeleton variant="text" width="88%" height={28} />
              <Skeleton variant="text" width="52%" />
              <Skeleton variant="text" width="40%" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (result.error) return <Alert severity="error">{result.error}</Alert>;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {categories.map((cat) => {
          const normalized = cat.toLowerCase();
          const active = normalized === category;

          return (
            <Chip
              key={cat}
              clickable
              label={cat}
              onClick={() => changeCategory(normalized)}
              className={[
                "!rounded-lg !px-1 !text-sm !font-semibold",
                active
                  ? "!bg-white !text-black"
                  : "!bg-[#272727] !text-[#f1f1f1] hover:!bg-[#3a3a3a]",
              ].join(" ")}
            />
          );
        })}
      </div>

      {filteredSongs.length === 0 ? (
        <Typography color="text.secondary">No songs found.</Typography>
      ) : (
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSongs.map((s) => (
            <SongCard key={s.id} song={s} />
          ))}
        </div>
      )}
    </div>
  );
}