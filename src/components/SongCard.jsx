import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getYouTubeId, isYouTubeUrl } from "../utils/video.js";

function thumbFor(song) {
  if (isYouTubeUrl(song.url)) {
    const id = getYouTubeId(song.url);
    if (id) return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  }
  return "";
}

export default function SongCard({ song, variant = "grid" }) {
  const navigate = useNavigate();
  const thumb = thumbFor(song);

  const isCompact = variant === "compact";

  if (isCompact) {
    return (
      <Card className="bg-transparent" elevation={0}>
        <CardActionArea
          onClick={() => navigate(`/watch/${song.id}`)}
          className="rounded-xl p-1"
        >
          <div className="flex gap-3">
            <div className="w-44 shrink-0 overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10">
              <div className="aspect-video">
                {thumb ? (
                  <img
                    src={thumb}
                    alt={song.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-zinc-400 text-sm">
                    No thumbnail
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1 py-1">
              <Typography
                variant="subtitle2"
                fontWeight={800}
                className="line-clamp-2 leading-snug"
              >
                {song.title || "Untitled"}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {song.artist || "Unknown artist"}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {song.album || "Unknown album"}
              </Typography>
            </div>
          </div>
        </CardActionArea>
      </Card>
    );
  }

  // Grid (home feed)
  return (
    <Card className="bg-transparent" elevation={0}>
      <CardActionArea
        onClick={() => navigate(`/watch/${song.id}`)}
        className="group rounded-2xl p-1"
      >
        <div className="overflow-hidden rounded-2xl bg-zinc-900 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
          <div className="relative aspect-video w-full">
            {thumb ? (
              <img
                src={thumb}
                alt={song.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-zinc-400">
                No thumbnail
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
          </div>
        </div>

        <CardContent className="px-2 pt-2">
          <Typography
            variant="subtitle1"
            fontWeight={900}
            className="line-clamp-2 leading-snug"
            title={song.title}
          >
            {song.title || "Untitled"}
          </Typography>

          <Typography variant="body2" color="text.secondary" noWrap>
            {song.artist || "Unknown artist"}
          </Typography>

          <Typography variant="caption" color="text.secondary" noWrap>
            {song.album || "Unknown album"} {song.genre ? `• ${song.genre}` : ""}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}