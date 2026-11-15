import { useCallback, useEffect, useRef, useState } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  List,
  X,
  ArrowUpRight,
} from "lucide-react";
import { Brand } from "./components";
import { chapters } from "./data";
import MusicController from "./MusicController";
import BookPageTurn from "./BookPageTurn";
import {
  PosterScene,
  WhyScene,
  TimelineScene,
  VisionScene,
  FinaleScene,
} from "./Scenes";
import {
  isInteractive,
  scenes,
  useSceneNavigation,
} from "./useSceneNavigation";
import "./App.css";
import "./lookbook.css";
import "./page-turn.css";

export default function App() {
  const reduced = useReducedMotion();
  const nav = useSceneNavigation(reduced);
  const [ducked, setDucked] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenMessage, setFullscreenMessage] = useState("");
  const [autoIntro, setAutoIntro] = useState(false);
  const dialog = useRef(null);
  const menuButton = useRef(null);
  const restoreMenuFocus = useRef(true);
  const gesture = useRef(null);
  const timelineChapter = chapters.find((c) => c.id === nav.id);
  const continueIntro = useCallback(
    () => nav.change("fall-2025"),
    [nav.change],
  );
  useEffect(() => {
    setDucked(false);
  }, [nav.id]);
  useEffect(() => {
    const changed = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", changed);
    return () => document.removeEventListener("fullscreenchange", changed);
  }, []);
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen)
        await document.documentElement.requestFullscreen();
      else
        setFullscreenMessage(
          "Fullscreen is unavailable. The scene presentation still works in this window.",
        );
    } catch {
      setFullscreenMessage(
        "Fullscreen was unavailable. Continue the presentation in this window.",
      );
    }
  }
  function openChapters() {
    dialog.current?.showModal();
  }
  function chooseChapter(e, id) {
    e.preventDefault();
    setAutoIntro(false);
    restoreMenuFocus.current = id === nav.id;
    dialog.current?.close();
    nav.change(id);
  }
  function pointerDown(e) {
    gesture.current = null;
    if (
      e.pointerType !== "touch" ||
      !e.isPrimary ||
      isInteractive(e.target) ||
      e.clientX < 24 ||
      e.clientX > innerWidth - 24
    )
      return;
    gesture.current = { x: e.clientX, y: e.clientY, time: performance.now() };
  }
  function pointerUp(e) {
    const start = gesture.current;
    gesture.current = null;
    if (!start) return;
    const dx = e.clientX - start.x,
      dy = e.clientY - start.y;
    if (
      performance.now() - start.time < 850 &&
      Math.abs(dx) > 70 &&
      Math.abs(dx) > Math.abs(dy) * 1.7 &&
      Math.abs(dy) < 60
    ) {
      setAutoIntro(false);
      nav.step(dx < 0 ? 1 : -1);
    }
  }
  return (
    <MotionConfig reducedMotion="user">
      <div className={`app scene-${nav.id}`}>
        <button
          className="skip-link"
          onClick={() =>
            document.querySelector("[data-scene-heading]")?.focus()
          }
        >
          Skip to current scene
        </button>
        <header className="site-header">
          <Brand />
          <span className="header-act eyebrow">
            {scenes[nav.index].act} <span>/</span> A CAMPAIGN IN CHAPTERS
          </span>
          <div className="header-actions">
            <button
              className="fullscreen-button icon-button"
              onClick={toggleFullscreen}
              aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {fullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
            </button>
            <button
              className="chapters-button"
              aria-label="Chapters"
              ref={menuButton}
              onClick={openChapters}
              disabled={nav.busy}
              aria-haspopup="dialog"
            >
              <List size={17} />
              <span>Chapters</span>
            </button>
          </div>
        </header>

        <main
          id="scene-stage"
          className="scene-stage"
          aria-label="Campaign presentation"
          onPointerDown={pointerDown}
          onPointerUp={pointerUp}
          onPointerCancel={() => {
            gesture.current = null;
          }}
        >
          <div className="book-underlay" aria-hidden="true" />
          <BookPageTurn
            sceneId={nav.id}
            direction={nav.direction}
            reduced={reduced}
            onComplete={nav.release}
          >
            <section
              className="scene-scroll"
              key={nav.id}
              data-scene={nav.id}
              aria-label={scenes[nav.index].name}
            >
              <div className="spread-furniture" aria-hidden="true">
                <span className="running-head">
                  ALPFA NJIT / THE CAMPAIGN LOOKBOOK
                </span>
                <span className="running-edition">
                  ANABHAYAN AHRURAN — 2026
                </span>
                <span className="margin-type">
                  {scenes[nav.index].act.toUpperCase()} / COMMUNITY FIRST.
                  ALWAYS.
                </span>
                <span className="print-credit">
                  INDEPENDENT CAMPAIGN PUBLICATION
                </span>
                <span className="folio-left">
                  {String(nav.index * 2 + 1).padStart(3, "0")}
                </span>
                <span className="folio-right">
                  {String(nav.index * 2 + 2).padStart(3, "0")}
                </span>
              </div>
              {nav.id === "home" && (
                <PosterScene
                  onYes={() => {
                    setAutoIntro(true);
                    nav.change("why");
                  }}
                  onSkip={() => {
                    setAutoIntro(false);
                    nav.change("fall-2025");
                  }}
                />
              )}
              {nav.id === "why" && (
                <WhyScene auto={autoIntro} onContinue={continueIntro} />
              )}
              {timelineChapter && (
                <TimelineScene
                  chapter={timelineChapter}
                  onMomentChange={setDucked}
                />
              )}
              {nav.id === "vision" && <VisionScene />}
              {nav.id === "finale" && (
                <FinaleScene
                  onReplay={() => {
                    setAutoIntro(false);
                    nav.change("home");
                  }}
                  onChapters={openChapters}
                  onMomentChange={setDucked}
                />
              )}
            </section>
          </BookPageTurn>
        </main>

        <footer className="scene-footer">
          <div className="footer-status">
            <span className="scene-number">
              {String(nav.index + 1).padStart(2, "0")}
              <span>/ {String(scenes.length).padStart(2, "0")}</span>
            </span>
            <span className="scene-name">{scenes[nav.index].name}</span>
          </div>
          <div className="footer-center">
            <div
              className="scene-progress"
              role="progressbar"
              aria-label="Scene progress"
              aria-valuemin={1}
              aria-valuemax={scenes.length}
              aria-valuenow={nav.index + 1}
            >
              <span
                style={{ width: `${((nav.index + 1) / scenes.length) * 100}%` }}
              />
            </div>
            <span className="navigation-tip">← → KEYS OR SWIPE TO EXPLORE</span>
          </div>
          <nav className="scene-navigation" aria-label="Scene navigation">
            <button
              className="previous-button"
              disabled={nav.index === 0 || nav.busy}
              onClick={() => {
                setAutoIntro(false);
                nav.step(-1);
              }}
              aria-label="Previous scene"
            >
              <ArrowLeft size={18} />
              <span>Previous</span>
            </button>
            <button
              className="next-button"
              disabled={nav.index === scenes.length - 1 || nav.busy}
              onClick={() => {
                setAutoIntro(false);
                nav.step(1);
              }}
              aria-label="Next scene"
            >
              <span>Next</span>
              <ArrowRight size={18} />
            </button>
          </nav>
        </footer>
        <MusicController ducked={ducked} />
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {nav.announcement}
        </div>
        {fullscreenMessage && (
          <div className="fullscreen-message" role="status">
            {fullscreenMessage}
            <button
              className="icon-button"
              onClick={() => setFullscreenMessage("")}
              aria-label="Dismiss fullscreen message"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <dialog
          ref={dialog}
          className="chapter-dialog"
          aria-labelledby="chapter-menu-title"
          onClose={() => {
            if (restoreMenuFocus.current) menuButton.current?.focus();
            restoreMenuFocus.current = true;
          }}
          onClick={(e) => {
            if (e.target === dialog.current) dialog.current.close();
          }}
        >
          <div className="chapter-dialog-inner">
            <div className="dialog-heading">
              <span className="eyebrow">A CAMPAIGN IN CHAPTERS</span>
              <button
                className="icon-button"
                aria-label="Close chapter menu"
                onClick={() => dialog.current.close()}
              >
                <X size={20} />
              </button>
            </div>
            <h2 id="chapter-menu-title">
              Pick up
              <br />
              <em>anywhere.</em>
            </h2>
            <nav aria-label="Chapter selection">
              {scenes.map((s, i) => (
                <a
                  href={`#${s.id}`}
                  key={s.id}
                  aria-current={s.id === nav.id ? "step" : undefined}
                  onClick={(e) => chooseChapter(e, s.id)}
                >
                  <span className="mono">0{i + 1}</span>
                  <span>{s.name}</span>
                  <ArrowUpRight size={17} />
                </a>
              ))}
            </nav>
            <p>Move at your pace. Every chapter is part of the story.</p>
          </div>
        </dialog>
      </div>
    </MotionConfig>
  );
}
