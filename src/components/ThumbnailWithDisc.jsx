export default function ThumbnailWithDisc({
  src,
  alt,
  fallbackText = "No thumbnail",
  className = "",
  thumbFrameClassName = "",
  imageClassName = "",
  discClassName = "",
  fallbackClassName = "",
}) {
  return (
    <div
      className={[
        "relative overflow-visible bg-zinc-900 ring-1 ring-white/10",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-none absolute left-0 top-1/2 z-0 grid -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#111111] shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
          discClassName,
        ].join(" ")}
      >
        <div className="grid h-[72%] w-[72%] place-items-center rounded-full bg-[#ff3355]">
          <div className="h-[42%] w-[42%] rounded-full border-2 border-[#111111] bg-[#0f0f0f]" />
        </div>
      </div>

      <div
        className={[
          "relative z-10 h-full overflow-hidden",
          thumbFrameClassName,
        ].join(" ")}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className={[
              "h-full w-full object-cover",
              imageClassName,
            ].join(" ")}
            loading="lazy"
          />
        ) : (
          <div
            className={[
              "grid h-full w-full place-items-center text-zinc-400",
              fallbackClassName,
            ].join(" ")}
          >
            {fallbackText}
          </div>
        )}
      </div>
    </div>
  );
}
