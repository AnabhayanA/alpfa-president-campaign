import { useEffect, useRef, useState } from "react";
import { Music2, Play, Pause, Volume2, VolumeX, X } from "lucide-react";

import { assetUrl } from "./assetUrl";
export const LOCAL_AUDIO = assetUrl("/assets/audio/campaign-theme.mp3");

// One persistent player, outside the scene transition tree. Never autoplays.
export default function MusicController({ ducked }) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [pending, setPending] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [message, setMessage] = useState("");
  const playerRef = useRef(null);
  const fadeRef = useRef(null);
  const requestRef = useRef(0);
  const playTimer = useRef(null);
  const pauseAfterFade = useRef(false);
  const launcher = useRef(null);
  useEffect(() => {
    const player = new Audio();
    player.loop = true;
    player.preload = "none";
    player.volume = 0;
    playerRef.current = player;
    const error = () => {
      requestRef.current++;
      clearTimeout(playTimer.current);
      setPending(false);
      setPlaying(false);
      setMessage(
        "The soundtrack could not be loaded. You can keep exploring with music off, or try again.",
      );
    };
    player.addEventListener("error", error);
    return () => {
      clearTimeout(playTimer.current);
      cancelAnimationFrame(fadeRef.current);
      player.removeEventListener("error", error);
      player.pause();
      player.removeAttribute("src");
      player.load();
      playerRef.current = null;
      requestRef.current++;
    };
  }, []);
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    cancelAnimationFrame(fadeRef.current);
    const start = player.volume;
    const target = playing && !muted ? volume * (ducked ? 0.35 : 1) : 0;
    const began = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - began) / 350, 1);
      player.volume = Math.max(
        0,
        Math.min(1, start + (target - start) * progress),
      );
      if (progress < 1) fadeRef.current = requestAnimationFrame(tick);
      else if (pauseAfterFade.current && !playing) {
        player.pause();
        pauseAfterFade.current = false;
      }
    };
    fadeRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(fadeRef.current);
  }, [playing, muted, volume, ducked]);
  async function togglePlayback() {
    const player = playerRef.current;
    if (!player || pending) return;
    if (playing) {
      pauseAfterFade.current = true;
      setPlaying(false);
      return;
    }
    pauseAfterFade.current = false;
    const request = ++requestRef.current;
    setPending(true);
    setMessage("");
    if (!player.getAttribute("src") || player.error) {
      player.src = LOCAL_AUDIO;
      player.load();
    }
    playTimer.current = setTimeout(() => {
      if (request !== requestRef.current) return;
      requestRef.current++;
      player.pause();
      setPending(false);
      setMessage(
        "The soundtrack is taking too long to start. Check your connection and try again.",
      );
    }, 12000);
    try {
      // Directly inside the visitor action, preserving mobile playback permission.
      await player.play();
      if (request === requestRef.current) setPlaying(true);
    } catch {
      if (request === requestRef.current)
        setMessage(
          "Playback was blocked or the file is unavailable. Try enabling music again; the presentation works with sound off.",
        );
    } finally {
      if (request === requestRef.current) {
        clearTimeout(playTimer.current);
        setPending(false);
      }
    }
  }
  function close() {
    setOpen(false);
    launcher.current?.focus();
  }
  return (
    <div className="music-controller" data-no-swipe>
      <button
        ref={launcher}
        className={`music-launcher ${playing ? "music-enabled" : ""}`}
        aria-label={open ? "Hide music controls" : "Open music controls"}
        aria-expanded={open}
        aria-controls="music-panel"
        onClick={() => setOpen((v) => !v)}
      >
        <Music2 size={16} />
        <span>Soundtrack</span>
        <span className="music-dot" />
      </button>
      <section
        id="music-panel"
        className="music-panel"
        hidden={!open}
        aria-label="Music controls"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            close();
          }
        }}
      >
        <div className="panel-heading">
          <span className="eyebrow">THE SOUNDTRACK</span>
          <button
            className="icon-button"
            aria-label="Close music controls"
            onClick={close}
          >
            <X size={17} />
          </button>
        </div>
        <h2>
          A little rhythm.
          <br />
          Your choice.
        </h2>
        <div className="local-player">
          <p className="music-note">
            Your campaign soundtrack. Music stays with you across every chapter.
          </p>
          <div className="local-player-buttons">
            <button
              className="button red-button"
              disabled={pending}
              onClick={togglePlayback}
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}{" "}
              {pending ? "Starting…" : playing ? "Pause music" : "Enable music"}
            </button>
            <button
              className="icon-button"
              aria-label={muted ? "Unmute music" : "Mute music"}
              aria-pressed={muted}
              onClick={() => setMuted((v) => !v)}
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
          <label className="volume-label" htmlFor="music-volume">
            Volume <span>{Math.round(volume * 100)}%</span>
          </label>
          <input
            id="music-volume"
            type="range"
            min="0"
            max="1"
            step=".01"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
          <p className="music-note">
            {ducked && playing
              ? "Volume softened for this meme moment."
              : "Starts quietly. Plays only when you enable it."}
          </p>
        </div>
        {message && (
          <p className="music-error" role="status">
            {message}
          </p>
        )}
      </section>
    </div>
  );
}
