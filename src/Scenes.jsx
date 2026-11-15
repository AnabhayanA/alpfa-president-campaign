import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import gsap from "gsap";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  RotateCcw,
  Sparkles,
  Users,
  Check,
} from "lucide-react";
import { Gallery, Media, MemeMoment } from "./components";
import {
  chapters,
  portrait,
  visions,
  finaleMedia,
  photoAlbum,
  finaleCat,
  chapterLogo,
} from "./data";

export function PosterScene({ onYes, onSkip }) {
  const reduced = useReducedMotion();
  const [dodges, setDodges] = useState(0);
  const no = useRef(null);
  const poster = useRef(null);
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(
      () =>
        gsap.from(".poster-line", {
          yPercent: 15,
          opacity: 0,
          stagger: 0.1,
          duration: 0.55,
          ease: "power2.out",
          clearProps: "all",
        }),
      poster,
    );
    return () => ctx.revert();
  }, [reduced]);
  function dodge(e) {
    if (
      reduced ||
      e.pointerType !== "mouse" ||
      document.activeElement === no.current
    )
      return;
    setDodges((v) => v + 1);
  }
  return (
    <div className="poster-scene" ref={poster}>
      <div className="poster-edition eyebrow">
        <div className="cover-masthead">
          <b>ALPFA</b>
          <span>NJIT</span>
          <small>ALPFA NJIT PRESIDENTIAL CAMPAIGN / 2026</small>
        </div>
        <span className="cover-issue">
          COMMUNITY / LEADERSHIP
          <br />
          ANABHAYAN AHRURAN / 2026
        </span>
      </div>
      <div className="poster-title">
        <h1 tabIndex={-1} data-scene-heading className="poster-line">
          VOTE
          <br />
          <span>FOR ME</span>
          <span className="poster-dot">.</span>
        </h1>
        <div className="poster-byline poster-line">
          <span className="small-cross" aria-hidden="true">
            ✳
          </span>
          <p>
            ANABHAYAN
            <br />
            <strong>AHRURAN</strong>
          </p>
        </div>
      </div>
      <figure className="campaign-portrait">
        <div className="portrait-topline eyebrow">
          <span>ANABHAYAN AHRURAN / PORTRAIT 01</span>
          <ArrowUpRight size={20} />
        </div>
        {portrait.src ? (
          <div className="cover-collage">
            <Media item={portrait} key={portrait.src} />
            <Media item={{ ...photoAlbum[1], fit: "cover" }} />
            <Media item={{ ...photoAlbum[3], fit: "cover" }} />
            <span className="cover-identity" aria-hidden="true">
              ALPFA<small>NJIT / OUR NEXT CHAPTER</small>
            </span>
          </div>
        ) : (
          <div
            className="portrait-placeholder"
            role="img"
            aria-label="Candidate portrait placeholder. Anabhayan’s photograph will be added here."
          >
            <span className="portrait-initials" aria-hidden="true">
              Aa.
            </span>
            <span className="portrait-placeholder-tag">
              PORTRAIT / PHOTO TO COME
            </span>
            <span className="portrait-coordinate" aria-hidden="true">
              01 / AHRURAN
            </span>
          </div>
        )}
        <figcaption>
          <span>
            Community first.
            <br />
            <em>Always.</em>
          </span>
          <span className="portrait-stamp">
            HERE
            <br />
            FOR
            <br />
            US ↗
          </span>
        </figcaption>
      </figure>
      <div className="poster-ask">
        <p className="eyebrow">SO, WILL YOU VOTE FOR ME?</p>
        <div className="vote-options">
          <motion.button
            className="button red-button"
            whileTap={reduced ? undefined : { scale: 1.04 }}
            onClick={onYes}
          >
            YES, I’M IN <ArrowUpRight size={19} />
          </motion.button>
          <div className="no-lane">
            <motion.button
              ref={no}
              className="button no-button"
              aria-label="No"
              onPointerEnter={dodge}
              onFocus={() => setDodges(0)}
              animate={{ x: reduced || !dodges ? 0 : dodges % 2 ? 28 : -12 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              onClick={onSkip}
            >
              NO <ArrowUpRight size={17} />
            </motion.button>
          </div>
        </div>
        <p className="vote-status" aria-live="polite">
          {dodges
            ? "NO has somewhere to be. Tab, tap, or skip works."
            : "A playful introduction. No votes are collected."}
        </p>
        <button className="text-button respectful-skip" onClick={onSkip}>
          Just show me the story <ArrowRight size={14} />
        </button>
      </div>
      <div className="poster-caption">
        <span className="blue-rule" />
        <p>
          I’ve shown up. I’ve built with you.
          <br />
          Now, let’s build what comes next.
        </p>
        <span className="poster-signature">
          A commitment.
          <br />
          Not just a title.
        </span>
      </div>
    </div>
  );
}

export function WhyScene({ auto, onContinue }) {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(onContinue, reduced ? 1000 : 1900);
    return () => clearTimeout(timer);
  }, [auto, onContinue, reduced]);
  return (
    <div className="why-scene">
      <span className="eyebrow">THE NEXT CHAPTER STARTS WITH US.</span>
      <h2 tabIndex={-1} data-scene-heading>
        LET ME
        <br />
        SHOW YOU
        <br />
        <em>WHY.</em>
      </h2>
      <button className="text-button" onClick={onContinue}>
        Start the story <ArrowRight size={20} />
      </button>
      <span className="why-footnote">A LITTLE HISTORY. A LOT OF HEART.</span>
    </div>
  );
}

export function TimelineScene({ chapter, onMomentChange }) {
  const number = chapters.indexOf(chapter);
  const [season, setSeason] = useState(false);
  return (
    <article className={`timeline-scene timeline-${chapter.id}`}>
      <header className="timeline-heading">
        <span className="eyebrow magazine-section">
          THE ALPFA JOURNAL<span>ACT II / THE JOURNEY</span>
        </span>
        <div className="semester">
          <span>{chapter.season}</span>
          <strong>{chapter.year}</strong>
          <span className="chapter-fraction">
            0{number + 1}
            <span>/ 05</span>
          </span>
        </div>
        <div
          className="timeline-track"
          aria-label={`Journey chapter ${number + 1} of 5`}
        >
          <motion.span
            initial={false}
            animate={{ width: `${(number + 1) * 20}%` }}
          />
        </div>
      </header>
      <div className="documentary-copy">
        <p className="eyebrow chapter-label">{chapter.label}</p>
        <h2 tabIndex={-1} data-scene-heading>
          {chapter.title.split("\n").map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="chapter-body">{chapter.body}</p>
        <ul className="chapter-points">
          {chapter.points.map((p) => (
            <li key={p}>
              <span aria-hidden="true">↗</span>
              {p}
            </li>
          ))}
        </ul>
        <p className="chapter-takeaway">{chapter.tag}</p>
        {chapter.moment && (
          <MemeMoment item={chapter.moment} onOpenChange={onMomentChange} />
        )}
      </div>
      <div className="documentary-media">
        {chapter.galleryNote && (
          <p className="gallery-context">{chapter.galleryNote}</p>
        )}
        <Gallery
          photos={chapter.photos}
          title={`${chapter.season} ${chapter.year}${chapter.id.includes("ideas") ? " ideas" : ""}`}
          inset={
            ["fall-2025", "spring-2026"].includes(chapter.id)
              ? chapter.photos[1]
              : undefined
          }
        />
        {chapter.id === "fall-2026" && (
          <div className="team-annotation">
            <Users size={19} />
            <p>
              <strong>5 + me = 6</strong>
              <span>People behind the next idea.</span>
            </p>
            <span className="eyebrow">
              WEEKLY
              <br />
              MEETINGS
            </span>
          </div>
        )}
        {chapter.id === "spring-2026-ideas" && (
          <button
            className="idea-note"
            onClick={() => setSeason(!season)}
            aria-expanded={season}
          >
            <span className="eyebrow">A NOTE ON THE TIMELINE</span>
            <span>
              {season
                ? "I ran for reelection. No result is claimed here."
                : "An idea is a starting point, not a finished product. ↗"}
            </span>
          </button>
        )}
      </div>
    </article>
  );
}

export function VisionScene() {
  const [active, setActive] = useState(0);
  return (
    <article className="manifesto-scene">
      <div className="manifesto-intro">
        <span className="eyebrow">ACT III / MY PRESIDENTIAL VISION</span>
        <h2 tabIndex={-1} data-scene-heading>
          BEYOND
          <br />
          ONE CAMPUS.
          <br />
          <em>
            One stronger
            <br />
            community.
          </em>
        </h2>
        <p>
          These are the goals I want to work toward.
          <br />
          With our members. With our board. Together.
        </p>
        <span className="manifesto-signature">Anabhayan Ahruran ↗</span>
        <figure className="manifesto-photo">
          <Media item={{ ...photoAlbum[3], fit: "cover" }} />
          <figcaption>The people behind the next chapter.</figcaption>
        </figure>
        <div className="vision-status">
          <span /> THE PLAN AHEAD / NOT COMPLETED ACHIEVEMENTS
        </div>
      </div>
      <div className="manifesto-list">
        {visions.map((v, i) => (
          <section
            className={`manifesto-item ${active === i ? "expanded" : ""}`}
            key={v.title}
          >
            <h3>
              <button
                onClick={() => setActive(active === i ? -1 : i)}
                aria-expanded={active === i}
                aria-controls={`priority-${i}`}
              >
                <span className="manifesto-number">0{i + 1}</span>
                <span>{v.title}</span>
                <span className="manifesto-toggle" aria-hidden="true">
                  {active === i ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div id={`priority-${i}`} hidden={active !== i}>
              <p>{v.text}</p>
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}

export function FinaleScene({ onReplay, onChapters, onMomentChange }) {
  const [encore, setEncore] = useState(false);
  const [confetti, setConfetti] = useState(0);
  const reduced = useReducedMotion();
  return (
    <article className={`finale-scene ${encore ? "encore-open" : ""}`}>
      <div className="finale-prelude">
        <span className="eyebrow">ACT IV / THE VERY SERIOUS FINALE</span>
        <h2 tabIndex={-1} data-scene-heading>
          {encore ? (
            <>
              YOU THOUGHT
              <br />I WAS <em>DONE?</em>
            </>
          ) : (
            <>
              That’s the story.
              <br />
              <em>Thank you.</em>
            </>
          )}
        </h2>
        <p>
          {encore
            ? "A campaign with a plan. And a sense of humor."
            : "For the conversations, the community, and the chance to keep showing up."}
        </p>
        <button
          className="button outline-button"
          aria-expanded={encore}
          onClick={() => {
            setEncore((v) => !v);
            setConfetti((v) => v + 1);
          }}
        >
          {encore ? "Okay, back to the campaign" : "Wait. Is that it?"}{" "}
          {encore ? <Check size={17} /> : <ArrowDown size={17} />}
        </button>
      </div>
      {encore && (
        <div className="finale-moments">
          <figure className="finale-cat">
            <Media item={finaleCat} />
            <figcaption>{finaleCat.caption}</figcaption>
          </figure>
          {finaleMedia.map((item) => (
            <MemeMoment
              key={item.caption}
              item={item}
              onOpenChange={onMomentChange}
            />
          ))}
          <p className="no-callback">Even the NO button made it to the end.</p>
          <button
            className="text-button"
            onClick={() => setConfetti((v) => v + 1)}
          >
            One more round of confetti <Sparkles size={16} />
          </button>
        </div>
      )}
      <div className="closing-poster">
        <img
          className="back-cover-logo"
          src={chapterLogo}
          width="500"
          height="500"
          alt="ALPFA NJIT chapter logo"
          loading="lazy"
        />
        <span className="eyebrow">
          ANABHAYAN AHRURAN / FOR ALPFA NJIT PRESIDENT
        </span>
        <p className="closing-vote">
          VOTE
          <br />
          <span>FOR ME.</span>
          <span aria-hidden="true" className="closing-star">
            ✳
          </span>
        </p>
        <div className="closing-bottom">
          <p>
            Community first.
            <br />
            <em>Always.</em>
          </p>
          <div>
            <button className="button dark-button" onClick={onReplay}>
              Replay the story <RotateCcw size={16} />
            </button>
            <button className="text-button" onClick={onChapters}>
              Choose a chapter <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
        <small>
          Thank you for being part of this chapter. This site does not collect
          votes.
        </small>
      </div>
      <details className="photo-album" data-no-swipe>
        <summary>
          More moments from the journey{" "}
          <span>{photoAlbum.length} photos ↗</span>
        </summary>
        <p>On campus, off campus, and everywhere the community takes us.</p>
        <Gallery photos={photoAlbum} title="photo album" />
      </details>
      {confetti > 0 && !reduced && (
        <div key={confetti} className="confetti" aria-hidden="true">
          {Array.from({ length: 28 }, (_, i) => (
            <span
              key={i}
              style={{
                "--x": `${(i * 37) % 100}%`,
                "--r": `${i * 43}deg`,
                "--delay": `${(i % 5) * 0.05}s`,
                "--color": ["var(--accent)", "var(--blue)", "var(--white)"][
                  i % 3
                ],
              }}
            />
          ))}
        </div>
      )}
    </article>
  );
}
