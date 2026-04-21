import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
  Alert,
  Button,
  Typography,
  Divider,
  Chip,
  Skeleton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { fetchSong, fetchSongs } from "../api.js";
import {
  getYouTubeEmbedUrl,
  getYouTubeId,
  isDirectAudioFile,
  isDirectVideoFile,
  isYouTubeUrl,
} from "../utils/video.js";
import SongCard from "../components/SongCard.jsx";

export default function WatchPage() {
  const { id } = useParams();
  const songId = Number(id);
  const navigate = useNavigate();
  const { setMiniPlayerTrack } = useOutletContext();

  const [result, setResult] = useState({
    song: null,
    upNext: [],
    error: "",
    songId: null,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [s, all] = await Promise.all([fetchSong(songId), fetchSongs()]);
        if (cancelled) return;

        const nextYtId = isYouTubeUrl(s.url) ? getYouTubeId(s.url) : null;
        const nextCanVideo = Boolean(nextYtId) || isDirectVideoFile(s.url);
        const nextCanAudio = isDirectAudioFile(s.url);

        if (nextCanAudio && !nextCanVideo) {
          setMiniPlayerTrack({
            id: s.id,
            title: s.title || "Untitled",
            artist: s.artist || "Unknown artist",
            url: s.url,
          });
        } else {
          setMiniPlayerTrack(null);
        }

        setResult({
          song: s,
          upNext: all.filter((x) => x.id !== songId).slice(0, 14),
          error: "",
          songId,
        });
      } catch (e) {
        if (!cancelled) {
          setResult({
            song: null,
            upNext: [],
            error: e?.message ?? "Failed to load song",
            songId,
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [songId, setMiniPlayerTrack]);

  const loading = result.songId !== songId;
  const song = result.song;
  const upNext = result.upNext;
  const error = result.error;

  const ytId = useMemo(() => {
    if (!song?.url) return null;
    if (!isYouTubeUrl(song.url)) return null;
    return getYouTubeId(song.url);
  }, [song]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
          <Skeleton variant="rounded" width={88} height={34} />
          <Skeleton variant="rounded" className="!h-auto !rounded-2xl">
            <div className="aspect-video w-full" />
          </Skeleton>
          <Skeleton variant="text" width="90%" height={42} />
          <div className="flex gap-2">
            <Skeleton variant="rounded" width={90} height={28} />
            <Skeleton variant="rounded" width={100} height={28} />
            <Skeleton variant="rounded" width={80} height={28} />
          </div>
        </div>

        <div className="space-y-3">
          <Skeleton variant="text" width={120} height={40} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton variant="rounded" width={176} height={100} />
              <div className="flex-1 space-y-2 pt-1">
                <Skeleton variant="text" width="95%" />
                <Skeleton variant="text" width="65%" />
                <Skeleton variant="text" width="50%" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!song) return <Alert severity="warning">Song not found.</Alert>;

  const canVideo = Boolean(ytId) || isDirectVideoFile(song.url);
  const canAudio = isDirectAudioFile(song.url);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            variant="text"
            className="!normal-case"
          >
            Back
          </Button>
        </div>

        <div className="w-full overflow-hidden rounded-2xl bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
          <div className="aspect-video w-full">
            {ytId ? (
              <iframe
                className="h-full w-full"
                src={getYouTubeEmbedUrl(ytId)}
                title={song.title}
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : isDirectVideoFile(song.url) ? (
              <video
                className="h-full w-full"
                controls
                autoPlay
                playsInline
                preload="metadata"
                src={song.url}
              />
            ) : canAudio ? (
              <div className="h-full w-full flex flex-col items-center justify-center gap-4 p-6">
                <Typography fontWeight={800}>Audio track</Typography>
                <audio controls autoPlay src={song.url} className="w-full" />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center px-6 text-center text-zinc-300">
                Unsupported URL for playback:
                <br />
                <span className="break-all">{song.url}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Typography variant="h6" fontWeight={900} className="leading-snug">
            {song.title || "Untitled"}
          </Typography>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            {song.artist ? <Chip size="small" label={song.artist} /> : null}
            {song.album ? <Chip size="small" label={song.album} /> : null}
            {song.genre ? <Chip size="small" label={song.genre} /> : null}
            {!canVideo && !canAudio ? (
              <Chip size="small" color="warning" label="Not playable" />
            ) : null}
          </div>

          <Divider className="opacity-30" />

          <Typography variant="body2" color="text.secondary" className="break-all">
            Source: {song.url}
          </Typography>
        </div>
      </div>

      <div className="space-y-3 xl:sticky xl:top-[88px] xl:h-[calc(100vh-104px)] xl:overflow-y-auto pr-1">
        <Typography variant="h6" fontWeight={900} className="tracking-tight">
          Up next
        </Typography>

        <div className="grid grid-cols-1 gap-4">
          {upNext.map((s) => (
            <SongCard key={s.id} song={s} variant="compact" />
          ))}
        </div>
      </div>
    </div>
  );
}