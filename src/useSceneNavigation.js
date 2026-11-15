import { useCallback, useEffect, useRef, useState } from "react";
import { chapters } from "./data";

export const scenes = [
  { id: "home", name: "Welcome poster", act: "Welcome" },
  { id: "why", name: "Let me show you why", act: "The invitation" },
  ...chapters.map((c) => ({
    id: c.id,
    name: `${c.season} ${c.year} · ${c.label}`,
    act: "The journey",
  })),
  { id: "vision", name: "My presidential vision", act: "The manifesto" },
  { id: "finale", name: "One more thing", act: "The finale" },
];
function sceneFromHash() {
  return scenes.find((s) => `#${s.id}` === window.location.hash)?.id || "home";
}
export const isInteractive = (target) =>
  target instanceof Element &&
  !!target.closest(
    'button,a,input,textarea,select,audio,video,iframe,summary,[role="dialog"],[role="slider"],[contenteditable="true"],[data-no-swipe]',
  );

export function useSceneNavigation(reduced) {
  const [current, setCurrent] = useState(() => ({
    id: sceneFromHash(),
    direction: 1,
  }));
  const latest = useRef(current.id);
  const locked = useRef(false);
  const timeout = useRef(null);
  const [busy, setBusy] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const index = scenes.findIndex((s) => s.id === current.id);
  const release = useCallback(() => {
    clearTimeout(timeout.current);
    locked.current = false;
    setBusy(false);
    const position = scenes.findIndex((s) => s.id === latest.current);
    setAnnouncement(
      `Scene ${position + 1} of ${scenes.length}: ${scenes[position].name}`,
    );
    document
      .querySelector("[data-scene-heading]")
      ?.focus({ preventScroll: true });
  }, []);
  const change = useCallback(
    (id, history = true) => {
      if (
        !scenes.some((s) => s.id === id) ||
        id === latest.current ||
        (history && locked.current)
      )
        return false;
      const from = scenes.findIndex((s) => s.id === latest.current);
      const to = scenes.findIndex((s) => s.id === id);
      locked.current = true;
      setBusy(true);
      latest.current = id;
      if (history) window.history.pushState(null, "", `#${id}`);
      setCurrent({ id, direction: to > from ? 1 : -1 });
      clearTimeout(timeout.current);
      timeout.current = setTimeout(release, reduced ? 100 : 1400);
      return true;
    },
    [reduced, release],
  );
  // AnimatePresence skips its initial animation; deep-linked first scenes still
  // need an announcement and a stable keyboard starting point.
  useEffect(() => {
    const frame = requestAnimationFrame(release);
    return () => cancelAnimationFrame(frame);
  }, [release]);
  const step = useCallback(
    (direction) => {
      const position = scenes.findIndex((s) => s.id === latest.current);
      if (scenes[position + direction]) change(scenes[position + direction].id);
    },
    [change],
  );
  useEffect(() => {
    if (!scenes.some((s) => `#${s.id}` === location.hash))
      history.replaceState(null, "", "#home");
    const handler = () => change(sceneFromHash(), false);
    window.addEventListener("popstate", handler);
    window.addEventListener("hashchange", handler);
    return () => {
      window.removeEventListener("popstate", handler);
      window.removeEventListener("hashchange", handler);
    };
  }, [change]);
  useEffect(() => {
    const handler = (e) => {
      if (
        e.defaultPrevented ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        isInteractive(e.target)
      )
        return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [step]);
  useEffect(() => () => clearTimeout(timeout.current), []);
  return { ...current, index, busy, change, step, release, announcement };
}
