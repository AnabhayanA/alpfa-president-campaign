import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { chapterLogo } from "./data";
import {
  ArrowUpRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Users,
  Heart,
  Sparkles,
  Goal,
  Megaphone,
  Building2,
  Network,
  CalendarDays,
  Play,
  Smile,
} from "lucide-react";

const icons = {
  soccer: Goal,
  community: Heart,
  marketing: Megaphone,
  campus: Building2,
  network: Network,
  calendar: CalendarDays,
  spark: Sparkles,
  team: Users,
  gif: Play,
  meme: Smile,
  networking: Network,
  committee: Users,
  app: Building2,
};
export function Icon({ name, ...props }) {
  const Component = icons[name] || Camera;
  return <Component {...props} aria-hidden="true" />;
}
export function Brand() {
  const [logoFailed, setLogoFailed] = useState(false);
  return (
    <a className="brand" href="#home" aria-label="Campaign home">
      {logoFailed ? (
        <span className="brand-symbol">
          a<span>↗</span>
        </span>
      ) : (
        <img
          className="chapter-logo"
          src={chapterLogo}
          alt="ALPFA NJIT chapter logo"
          width="500"
          height="500"
          onError={() => setLogoFailed(true)}
        />
      )}
      <span>
        ALPFA <b>NJIT</b>
        <small>ANABHAYAN FOR PRESIDENT</small>
      </span>
    </a>
  );
}

export function Media({ item, className = "" }) {
  const reduced = useReducedMotion();
  const [playAnimated, setPlayAnimated] = useState(false);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const isGif = /\.gif(?:\?|$)/i.test(item.src);
  const pausedGif = isGif && (paused || (reduced && !playAnimated));
  const displaySrc = pausedGif ? item.poster : item.src;
  return (
    <div className={`media ${className} media-${item.kind || "portrait"}`}>
      {displaySrc && !failed ? (
        <>
          <img
            key={displaySrc}
            src={displaySrc}
            alt={item.alt}
            loading={item.eager ? "eager" : "lazy"}
            fetchPriority={item.eager ? "high" : "auto"}
            width={item.width}
            height={item.height}
            decoding="async"
            srcSet={pausedGif ? undefined : item.srcSet}
            sizes={item.sizes || "(max-width: 760px) 100vw, 50vw"}
            style={{
              objectPosition: item.position || "center",
              objectFit: item.fit || "cover",
            }}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
          {!loaded && (
            <span className="media-loading" role="status">
              Loading photo…
            </span>
          )}
        </>
      ) : (
        <div className="media-art" role="img" aria-label={item.alt}>
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <span className="art-icon">
            <Icon name={item.kind} size={52} strokeWidth={1} />
          </span>
          <span className="media-placeholder-label">
            {failed
              ? "Photo unavailable · placeholder"
              : `${item.kind || "portrait"} / photo to come`}
          </span>
        </div>
      )}
      {isGif && (
        <button
          className="gif-toggle"
          onClick={() => {
            if (pausedGif) {
              setPlayAnimated(true);
              setPaused(false);
            } else setPaused(true);
          }}
        >
          {pausedGif ? "Play GIF" : "Pause GIF"}
        </button>
      )}
    </div>
  );
}

export function Gallery({ photos, title, inset }) {
  const [index, setIndex] = useState(0);
  const photo = photos[index];
  return (
    <div className="gallery">
      <motion.figure
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Media item={photo} />
        <figcaption aria-live="polite" aria-atomic="true">
          <span>{photo.caption}</span>
          <span className="mono">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(photos.length).padStart(2, "0")}
          </span>
        </figcaption>
      </motion.figure>
      {inset && (
        <aside className="photo-inset">
          <Media item={{ ...inset, fit: "cover" }} />
          <span>FROM THE PHOTO ALBUM ↗</span>
        </aside>
      )}
      <div className="gallery-controls">
        <span className="eyebrow">THE CHAPTER IN FRAMES</span>
        <div>
          <button
            className="icon-button"
            onClick={() =>
              setIndex((index - 1 + photos.length) % photos.length)
            }
            aria-label={`Previous photo in ${title}`}
          >
            <ChevronLeft size={17} />
          </button>
          <button
            className="icon-button"
            onClick={() => setIndex((index + 1) % photos.length)}
            aria-label={`Next photo in ${title}`}
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function VisionCard({ item, index, active, onClick }) {
  return (
    <button
      className={`vision-card ${active ? "selected" : ""}`}
      onClick={onClick}
      aria-expanded={active}
      aria-controls="vision-detail"
    >
      <span className="vision-card-top">
        <Icon name={item.icon} size={24} strokeWidth={1.4} />
        <span className="mono">0{index + 1}</span>
      </span>
      <span className="vision-card-title">{item.title}</span>
      <span className="vision-card-bottom">
        {item.short}
        <ArrowUpRight size={18} />
      </span>
    </button>
  );
}

// Inline documentary asides. Missing media is always identified as a placeholder.
export function MemeMoment({ item, onOpenChange }) {
  const [open, setOpen] = useState(false);
  return (
    <aside className={`meme-moment ${open ? "is-open" : ""}`} data-no-swipe>
      <button
        className="moment-toggle"
        aria-expanded={open}
        onClick={() => {
          setOpen(!open);
          onOpenChange?.(!open);
        }}
      >
        <Smile size={17} />
        <span>
          {open
            ? "Back to the documentary"
            : "A brief, very serious intermission"}
        </span>
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <motion.figure initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Media item={item} />
          <figcaption>{item.caption}</figcaption>
        </motion.figure>
      )}
    </aside>
  );
}
