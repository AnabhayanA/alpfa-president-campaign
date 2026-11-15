import { Component, createRef } from "react";

const DURATION = 900;
const STRIPS = 8;

// Capture only the visible printed spread, never the persistent audio player.
// Copies are inert and stripped of IDs so they cannot affect focus or deep links.
function snapshot(element) {
  const rect = element.getBoundingClientRect();
  const computed = getComputedStyle(element);
  const copy = element.cloneNode(true);
  copy.className = "page-copy";
  for (const node of [copy, ...copy.querySelectorAll("*")]) {
    node.removeAttribute("id");
    node.removeAttribute("data-scene");
    node.removeAttribute("data-scene-heading");
    node.removeAttribute("autofocus");
  }
  for (const image of copy.querySelectorAll("img")) image.loading = "eager";
  for (const loading of copy.querySelectorAll(".media-loading"))
    loading.remove();
  // Printed copies must not freeze a gallery partway through its fade-in.
  for (const figure of copy.querySelectorAll(".gallery > figure"))
    figure.style.opacity = "1";
  for (const property of [
    "color",
    "background-color",
    "background-image",
    "background-size",
    "--accent",
    "--text-muted",
    "--grey",
    "--line",
    "--blue",
  ]) {
    copy.style.setProperty(property, computed.getPropertyValue(property));
  }
  Object.assign(copy.style, {
    position: "absolute",
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    maxWidth: "none",
    margin: "0",
    padding: "0",
    overflow: "hidden",
    containerType: "inline-size",
    boxSizing: "border-box",
    transform: "none",
  });
  return { copy, rect, scrollTop: element.scrollTop };
}

function printCopy(source, offset) {
  const copy = source.copy.cloneNode(true);
  copy.style.left = `${-offset}px`;
  copy.style.top = "0";
  return copy;
}

export default class BookPageTurn extends Component {
  host = createRef();
  live = createRef();
  layer = createRef();
  animations = [];
  turnVersion = 0;

  getSnapshotBeforeUpdate(previous) {
    if (previous.sceneId === this.props.sceneId || this.props.reduced)
      return null;
    const spread = this.live.current?.querySelector(".scene-scroll");
    return spread ? snapshot(spread) : null;
  }

  componentDidUpdate(previous, _state, outgoing) {
    if (previous.sceneId !== this.props.sceneId) {
      this.finish(false);
      if (outgoing && !this.props.reduced) this.turn(outgoing);
      else this.props.onComplete();
    } else if (this.props.reduced && !previous.reduced) this.finish(true);
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    this.finish(false);
  }

  handleResize = () => {
    if (this.animations.length) this.finish(true);
  };

  finish = (notify) => {
    this.turnVersion++;
    for (const animation of this.animations) animation.cancel();
    this.animations = [];
    this.layer.current?.replaceChildren();
    if (this.live.current) this.live.current.inert = false;
    if (notify) this.props.onComplete();
  };

  turn(outgoing) {
    const spread = this.live.current?.querySelector(".scene-scroll");
    if (!spread || !Element.prototype.animate) {
      this.props.onComplete();
      return;
    }
    const incoming = snapshot(spread);
    const host = this.host.current.getBoundingClientRect();
    const version = this.turnVersion;
    const forward = this.props.direction > 0;
    const singlePage = matchMedia(
      "(max-width: 760px), (max-height: 500px)",
    ).matches;
    const bookWidth = outgoing.rect.width;
    const pageWidth = singlePage ? bookWidth : bookWidth / 2;
    const height = outgoing.rect.height;
    const stripWidth = pageWidth / STRIPS;
    const pageOffset = forward && !singlePage ? pageWidth : 0;
    const backOffset = !forward && !singlePage ? pageWidth : 0;
    const sign = forward ? -1 : 1;
    const layer = this.layer.current;
    const book = document.createElement("div");
    book.className = "turn-book";
    Object.assign(book.style, {
      left: `${outgoing.rect.left - host.left}px`,
      top: `${outgoing.rect.top - host.top}px`,
      width: `${bookWidth}px`,
      height: `${height}px`,
    });
    layer.append(book);

    // The page not being turned stays still, covering its future replacement.
    if (!singlePage) {
      const stationary = document.createElement("div");
      stationary.className = "turn-stationary";
      const offset = forward ? 0 : pageWidth;
      Object.assign(stationary.style, {
        left: `${offset}px`,
        width: `${pageWidth}px`,
      });
      const copy = printCopy(outgoing, offset);
      stationary.append(copy);
      book.append(stationary);
      copy.scrollTop = outgoing.scrollTop;
    }

    const groundShadow = document.createElement("div");
    groundShadow.className = "turn-ground-shadow";
    book.append(groundShadow);
    const leaf = document.createElement("div");
    leaf.className = "turn-leaf";
    leaf.dataset.direction = forward ? "forward" : "backward";
    Object.assign(leaf.style, {
      left: `${pageOffset}px`,
      width: `${pageWidth}px`,
      transformOrigin: forward ? "0% 50%" : "100% 50%",
    });
    book.append(leaf);

    // Linked strips form one flexible sheet: each joint adds a small bend.
    // Front = outgoing page; reverse = the incoming facing page.
    let parent = leaf;
    for (let i = 0; i < STRIPS; i++) {
      const strip = document.createElement("div");
      strip.className = "turn-strip";
      Object.assign(strip.style, {
        width: `${stripWidth}px`,
        left: `${i ? stripWidth : 0}px`,
      });
      parent.append(strip);
      for (const reverse of [false, true]) {
        const face = document.createElement("div");
        face.className = reverse ? "turn-face turn-face-back" : "turn-face";
        const source = reverse ? incoming : outgoing;
        const offset = reverse
          ? backOffset + pageWidth - (i + 1) * stripWidth
          : pageOffset + i * stripWidth;
        const copy = printCopy(source, offset);
        face.append(copy);
        const tint = document.createElement("div");
        tint.className = "turn-face-tint";
        face.append(tint);
        strip.append(face);
        copy.scrollTop = source.scrollTop;
        this.animations.push(
          tint.animate(
            [
              { opacity: 0 },
              { opacity: reverse ? 0.2 : 0.42, offset: 0.5 },
              { opacity: 0 },
            ],
            { duration: DURATION, fill: "both" },
          ),
        );
      }
      const bend = sign * (2 + i * 0.45);
      this.animations.push(
        strip.animate(
          [
            { transform: "rotateY(0deg)" },
            { transform: `rotateY(${bend}deg)`, offset: 0.32 },
            { transform: `rotateY(${bend * 0.65}deg)`, offset: 0.68 },
            { transform: "rotateY(0deg)" },
          ],
          {
            duration: DURATION,
            easing: "cubic-bezier(.35,0,.2,1)",
            fill: "both",
          },
        ),
      );
      parent = strip;
    }
    this.live.current.inert = true;
    this.animations.push(
      groundShadow.animate(
        [
          { opacity: 0.05, transform: "scaleX(.6)" },
          { opacity: 0.5, transform: "scaleX(1)", offset: 0.45 },
          { opacity: 0, transform: "scaleX(.7)" },
        ],
        { duration: DURATION, fill: "both" },
      ),
    );
    const animation = leaf.animate(
      [
        { transform: "translateZ(0px) rotateY(0deg)" },
        { transform: `translateZ(16px) rotateY(${sign * 48}deg)`, offset: 0.3 },
        {
          transform: `translateZ(22px) rotateY(${sign * 108}deg)`,
          offset: 0.57,
        },
        {
          transform: `translateZ(3px) rotateY(${sign * 168}deg)`,
          offset: 0.88,
        },
        { transform: `translateZ(0px) rotateY(${sign * 180}deg)` },
      ],
      { duration: DURATION, easing: "cubic-bezier(.35,0,.22,1)", fill: "both" },
    );
    this.animations.push(animation);
    animation.finished
      .then(() => {
        if (version === this.turnVersion) this.finish(true);
      })
      .catch(() => {});
  }

  render() {
    return (
      <div className="book-turn-host" ref={this.host}>
        <div className="book-live" ref={this.live}>
          {this.props.children}
        </div>
        <div
          className="page-turn-layer"
          ref={this.layer}
          aria-hidden="true"
          inert
        />
      </div>
    );
  }
}
