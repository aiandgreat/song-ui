import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, InputBase, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import CloseIcon from "@mui/icons-material/Close";
import { useRef, useState } from "react";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const inputRef = useRef(null);
  const [miniPlayerTrack, setMiniPlayerTrack] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hasSearchQuery = Boolean(initialQ.trim());
  const isHome = location.pathname === "/" && !hasSearchQuery;
  const isSearch = location.pathname === "/" && hasSearchQuery;
  const isWatch = location.pathname.startsWith("/watch/");

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
                <MusicNoteIcon fontSize="small" />
              </div>
            </IconButton>

            <Typography
              variant="h6"
              className="hidden sm:block select-none tracking-tight"
              onClick={() => navigate("/")}
              sx={{ cursor: "pointer" }}
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

          <div className="hidden md:block md:w-[260px]" />
        </Toolbar>
      </AppBar>

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