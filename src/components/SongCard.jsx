import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getYouTubeId, isYouTubeUrl } from "../utils/video.js";
import ThumbnailWithDisc from "./ThumbnailWithDisc.jsx";

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
            <ThumbnailWithDisc
              src={thumb}
              alt={song.title}
              fallbackText="No thumbnail"
              className="h-24 w-44 shrink-0 rounded-xl"
              thumbFrameClassName="ml-11 w-[calc(100%-2.75rem)] rounded-xl"
              discClassName="-left-5 h-20 w-20"
              imageClassName=""
              fallbackClassName="text-sm"
            />

            <div className="min-w-0 flex-1 py-1">
              <Typography
                variant="subtitle1"
                fontWeight={900}
                className="line-clamp-2 leading-snug text-white"
              >
                {song.title || "Untitled"}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={700}
                noWrap
                sx={{ color: "rgba(255,255,255,0.9)" }}
              >
                {song.artist || "Unknown artist"}
              </Typography>
              <Typography
                variant="caption"
                noWrap
                sx={{ color: "rgba(255,255,255,0.52)" }}
              >
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
          <ThumbnailWithDisc
            src={thumb}
            alt={song.title}
            fallbackText="No thumbnail"
            className="aspect-video w-full"
            thumbFrameClassName="ml-16 w-[calc(100%-4rem)] rounded-2xl"
            imageClassName="transition-transform duration-300 group-hover:scale-[1.02]"
            discClassName="-left-6 h-24 w-24"
            fallbackClassName=""
          />
          <div className="absolute inset-0 bg-black/0 transition-colors hover:bg-black/10" />
        </div>

        <CardContent className="px-2 pt-2">
          <Typography
            variant="h6"
            fontWeight={900}
            className="line-clamp-2 leading-snug text-white"
            title={song.title}
            sx={{ fontSize: "1.08rem" }}
          >
            {song.title || "Untitled"}
          </Typography>

          <Typography
            variant="body2"
            fontWeight={700}
            noWrap
            sx={{ color: "rgba(255,255,255,0.9)" }}
          >
            {song.artist || "Unknown artist"}
          </Typography>

          <Typography
            variant="caption"
            noWrap
            sx={{ color: "rgba(255,255,255,0.52)" }}
          >
            {song.album || "Unknown album"} {song.genre ? `• ${song.genre}` : ""}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}