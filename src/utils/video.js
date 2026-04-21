function toUrl(input = "") {
  if (!input) return null;
  try {
    return new URL(input);
  } catch {
    try {
      return new URL(`https://${input}`);
    } catch {
      return null;
    }
  }
}

export function isYouTubeUrl(url = "") {
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return true;

  const parsed = toUrl(url);
  if (!parsed) return false;

  const host = parsed.hostname.toLowerCase();
  return (
    host === "youtu.be" ||
    host.endsWith(".youtu.be") ||
    host === "youtube.com" ||
    host.endsWith(".youtube.com") ||
    host === "youtube-nocookie.com" ||
    host.endsWith(".youtube-nocookie.com")
  );
}

export function getYouTubeId(url = "") {
  if (!url) return null;

  // Accept raw ID (if you ever store just the ID)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

  try {
    const u = toUrl(url);
    if (!u) return null;
    const host = u.hostname.toLowerCase();

    // youtu.be/<id>
    if (host === "youtu.be" || host.endsWith(".youtu.be")) {
      const shortId = u.pathname.split("/").filter(Boolean)[0];
      if (shortId && /^[a-zA-Z0-9_-]{11}$/.test(shortId)) return shortId;
    }

    // youtube.com/watch?v=<id>
    const v = u.searchParams.get("v");
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

    // youtube.com/embed/<id>
    const embed = u.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embed?.[1]) return embed[1];

    // youtube.com/shorts/<id>
    const shorts = u.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shorts?.[1]) return shorts[1];

    // youtube.com/live/<id>
    const live = u.pathname.match(/\/live\/([a-zA-Z0-9_-]{11})/);
    if (live?.[1]) return live[1];
  } catch {
    // ignore
  }

  return null;
}

export function getYouTubeEmbedUrl(id) {
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export function isDirectVideoFile(url = "") {
  const parsed = toUrl(url);
  const value = parsed?.pathname ?? url;
  return /\.(mp4|webm|ogg|mov|m4v)$/i.test(value);
}

export function isDirectAudioFile(url = "") {
  const parsed = toUrl(url);
  const value = parsed?.pathname ?? url;
  return /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(value);
}