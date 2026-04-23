import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Paper,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AlbumIcon from "@mui/icons-material/Album";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useEffect, useRef, useState } from "react";
import { fetchSongs } from "../api";
import { getYouTubeId, isYouTubeUrl } from "../utils/video";
import ThumbnailWithDisc from "./ThumbnailWithDisc.jsx";

function getSongTimestamp(song) {
  const candidates = [
    song?.createdAt,
    song?.created_at,
    song?.dateAdded,
    song?.addedAt,
    song?.publishedAt,
    song?.updatedAt,
  ];

  for (const value of candidates) {
    if (value == null) continue;

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    const parsed = Date.parse(String(value));
    if (!Number.isNaN(parsed)) return parsed;
  }

  return null;
}

function getNotificationThumb(song) {
  if (isYouTubeUrl(song?.url)) {
    const ytId = getYouTubeId(song.url);
    if (ytId) return `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
  }
  return "";
}

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const inputRef = useRef(null);
  const [miniPlayerTrack, setMiniPlayerTrack] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [recentSongs, setRecentSongs] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const songs = await fetchSongs();
        if (cancelled) return;

        const newest = [...songs]
          .sort((a, b) => {
            const timeA = getSongTimestamp(a);
            const timeB = getSongTimestamp(b);

            if (timeA != null && timeB != null) return timeB - timeA;
            if (timeA != null) return -1;
            if (timeB != null) return 1;

            return Number(b?.id ?? 0) - Number(a?.id ?? 0);
          })
          .slice(0, 6);

        setRecentSongs(newest);
        setUnreadCount(newest.length);
      } catch {
        if (!cancelled) {
          setRecentSongs([]);
          setUnreadCount(0);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasSearchQuery = Boolean(initialQ.trim());
  const isHome = location.pathname === "/" && !hasSearchQuery;
  const isSearch = location.pathname === "/" && hasSearchQuery;
  const isWatch = location.pathname.startsWith("/watch/");
  const notificationsOpen = Boolean(notificationAnchor);

  function navClass(isActive, expanded = sidebarExpanded) {
    return [
      "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors",
      expanded ? "justify-start" : "justify-center",
      isActive
        ? "bg-white/12 text-white font-semibold"
        : "text-zinc-300 hover:bg-white/10 hover:text-white",
    ].join(" ");
  }

  function submit() {
    const trimmed = inputRef.current?.value?.trim() ?? "";
    navigate(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : "/");
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        className="border-b border-white/10 bg-[#0f0f0f]/90 backdrop-blur"
      >
        <Toolbar className="gap-2 sm:gap-4">
          <div className="flex min-w-0 flex-1 items-center md:w-[260px] md:flex-initial">
            <IconButton
              onClick={() => {
                if (window.matchMedia("(min-width: 1024px)").matches) {
                  setSidebarExpanded((prev) => !prev);
                  return;
                }
                setMobileMenuOpen((prev) => !prev);
              }}
              size="large"
              aria-label="Toggle sidebar"
              className="inline-flex"
            >
              <MenuIcon />
            </IconButton>

            <IconButton onClick={() => navigate("/")} size="large" aria-label="Home">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#ff0033] text-white">
                <AlbumIcon fontSize="small" />
              </div>
            </IconButton>

            <Typography
              variant="h6"
              className="hidden select-none uppercase tracking-widest sm:block"
              onClick={() => navigate("/")}
              style={{
                cursor: "pointer",
                fontFamily: '"Arial Black", Arial, sans-serif',
                fontWeight: 900,
              }}
            >
              DiscTrack
            </Typography>
          </div>

          <div className="flex flex-[2] justify-center">
            <Paper
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="mx-auto flex w-full max-w-2xl items-center overflow-hidden rounded-full border border-white/15 bg-[#121212] pl-4 pr-1 py-1"
              elevation={0}
            >
              <InputBase
                key={initialQ}
                inputRef={inputRef}
                defaultValue={initialQ}
                placeholder="Search title, artist, album, genre..."
                className="flex-1 text-white"
              />
              <IconButton
                type="submit"
                aria-label="search"
                className="!rounded-full !bg-[#272727]"
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </div>

          <div className="flex min-w-[96px] items-center justify-end gap-2 sm:gap-3 md:w-[260px]">
            <IconButton
              aria-label="Open notifications"
              onClick={(event) => {
                setNotificationAnchor(event.currentTarget);
                setUnreadCount(0);
              }}
            >
              <Badge badgeContent={unreadCount} color="error" max={9}>
                <NotificationsNoneIcon />
              </Badge>
            </IconButton>

            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: "#ef4444",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              A
            </Avatar>
          </div>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={notificationAnchor}
        open={notificationsOpen}
        onClose={() => setNotificationAnchor(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            minWidth: 310,
            bgcolor: "#171717",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.08)",
            mt: 1,
          },
        }}
      >
        <Typography variant="subtitle2" sx={{ px: 2, py: 1.5, fontWeight: 800 }}>
          Recently added songs
        </Typography>

        {recentSongs.length === 0 ? (
          <MenuItem disabled>No recently added songs.</MenuItem>
        ) : (
          recentSongs.map((song) => (
            <MenuItem
              key={song.id}
              onClick={() => {
                setNotificationAnchor(null);
                navigate(`/watch/${song.id}`);
              }}
              sx={{ alignItems: "flex-start", py: 1, gap: 1.25 }}
            >
              <ThumbnailWithDisc
                src={getNotificationThumb(song)}
                alt={song.title || "Song thumbnail"}
                fallbackText="No preview"
                className="h-12 w-[84px] shrink-0 rounded-md"
                thumbFrameClassName="ml-8 w-[calc(100%-2rem)] rounded-md"
                imageClassName=""
                discClassName="-left-3 h-14 w-14"
                fallbackClassName="text-[11px]"
              />

              <ListItemText
                primary={song.title || "Untitled"}
                secondary={song.artist || "Unknown artist"}
                primaryTypographyProps={{
                  fontWeight: 900,
                  noWrap: true,
                  sx: { color: "#ffffff", fontSize: "1rem" },
                }}
                secondaryTypographyProps={{
                  noWrap: true,
                  sx: { color: "rgba(255,255,255,0.88)", fontWeight: 700 },
                }}
              />
            </MenuItem>
          ))
        )}
      </Menu>

      <div
        className={[
          "mx-auto flex w-full max-w-[1600px] gap-6 px-3 py-4 sm:px-4 sm:py-5",
          miniPlayerTrack ? "pb-20" : "",
        ].join(" ")}
      >
        {mobileMenuOpen ? (
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        ) : null}

        <aside
          className={[
            "fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-[#171717] p-3 pt-24 transition-transform duration-300 lg:hidden",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <nav className="space-y-1 rounded-2xl border border-white/10 bg-[#111111] p-2">
            <button
              type="button"
              onClick={() => {
                navigate("/");
                setMobileMenuOpen(false);
              }}
              className={navClass(isHome, true)}
              title="Home"
            >
              <HomeIcon fontSize="small" />
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                navigate(hasSearchQuery ? `/?q=${encodeURIComponent(initialQ)}` : "/");
                setMobileMenuOpen(false);
              }}
              className={navClass(isSearch, true)}
              title="Search"
            >
              <ManageSearchIcon fontSize="small" />
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                if (miniPlayerTrack?.id) navigate(`/watch/${miniPlayerTrack.id}`);
                setMobileMenuOpen(false);
              }}
              className={navClass(isWatch, true)}
              title="Now playing"
            >
              <SmartDisplayIcon fontSize="small" />
              Now playing
            </button>
          </nav>
        </aside>

        <aside
          className={[
            "sticky top-[84px] hidden h-[calc(100vh-100px)] shrink-0 transition-all duration-300 lg:block",
            sidebarExpanded ? "w-56" : "w-20",
          ].join(" ")}
        >
          <nav className="space-y-1 rounded-2xl border border-white/10 bg-[#171717] p-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className={navClass(isHome)}
              title="Home"
            >
              <HomeIcon fontSize="small" />
              {sidebarExpanded ? "Home" : null}
            </button>
            <button
              type="button"
              onClick={() => navigate(hasSearchQuery ? `/?q=${encodeURIComponent(initialQ)}` : "/")}
              className={navClass(isSearch)}
              title="Search"
            >
              <ManageSearchIcon fontSize="small" />
              {sidebarExpanded ? "Search" : null}
            </button>
            <button
              type="button"
              onClick={() => {
                if (miniPlayerTrack?.id) navigate(`/watch/${miniPlayerTrack.id}`);
              }}
              className={navClass(isWatch)}
              title="Now playing"
            >
              <SmartDisplayIcon fontSize="small" />
              {sidebarExpanded ? "Now playing" : null}
            </button>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet context={{ setMiniPlayerTrack, miniPlayerTrack }} />
        </main>
      </div>

      {miniPlayerTrack ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#171717]/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-[1600px] items-center gap-3 px-3 py-2 sm:px-4">
            <div className="min-w-0 flex-1">
              <Typography variant="subtitle2" fontWeight={800} noWrap>
                {miniPlayerTrack.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {miniPlayerTrack.artist}
              </Typography>
            </div>

            <audio
              key={miniPlayerTrack.url}
              className="w-full max-w-md"
              controls
              autoPlay
              preload="metadata"
              src={miniPlayerTrack.url}
            />

            <IconButton
              size="small"
              aria-label="Close mini player"
              onClick={() => setMiniPlayerTrack(null)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}