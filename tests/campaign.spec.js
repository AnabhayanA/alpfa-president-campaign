import { test, expect } from "@playwright/test";

const sceneIds = [
  "home",
  "why",
  "fall-2025",
  "winter-2026",
  "spring-2026",
  "spring-2026-ideas",
  "fall-2026",
  "vision",
  "finale",
];

test("chapter logo and cat finale load, with pause and reduced-motion preview", async ({
  page,
}) => {
  await page.goto("/#finale");
  await ready(page, "finale");
  await expect
    .poll(() =>
      page
        .getByRole("img", { name: "ALPFA NJIT chapter logo" })
        .first()
        .evaluate((node) => node.complete && node.naturalWidth > 0),
    )
    .toBe(true);
  await page.getByRole("button", { name: "Wait. Is that it?" }).click();
  const cat = page.locator(".finale-cat img");
  await expect(cat).toHaveAttribute("src", "/assets/gifs/cat-catmeme.gif");
  await page.getByRole("button", { name: "Pause GIF", exact: true }).click();
  await expect(cat).toHaveAttribute("src", "/assets/gifs/cat-still.webp");
  await page.getByRole("button", { name: "Play GIF", exact: true }).click();
  await expect(cat).toHaveAttribute("src", "/assets/gifs/cat-catmeme.gif");
  await expect
    .poll(() => cat.evaluate((node) => node.complete && node.naturalWidth > 0))
    .toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await ready(page, "finale");
  await page.getByRole("button", { name: "Wait. Is that it?" }).click();
  await expect(cat).toHaveAttribute("src", "/assets/gifs/cat-still.webp");
  await expect(
    page.getByRole("button", { name: "Play GIF", exact: true }),
  ).toBeVisible();
});

test("a flexible sheet turns over a stationary spread in both directions", async ({
  page,
}) => {
  await page.goto("/#fall-2025");
  await ready(page, "fall-2025");
  await page.getByRole("button", { name: "Next scene", exact: true }).click();
  await expect(page.locator(".turn-leaf")).toHaveAttribute(
    "data-direction",
    "forward",
  );
  await expect(page.locator(".turn-strip")).toHaveCount(8);
  await expect(page.locator(".turn-face-back")).toHaveCount(8);
  await expect(page.locator(".turn-stationary")).toHaveCount(1);
  await expect(page.locator(".page-turn-layer")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  expect(
    await page
      .locator(".scene-scroll")
      .evaluate((node) => getComputedStyle(node).transform),
  ).toBe("none");
  expect(await page.locator(".page-turn-layer [id]").count()).toBe(0);
  await page.waitForTimeout(350);
  await page.screenshot({ path: "test-results/human-page-turn.png" });
  await ready(page, "winter-2026");
  await expect(page.locator(".turn-leaf")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Previous scene", exact: true })
    .click();
  await expect(page.locator(".turn-leaf")).toHaveAttribute(
    "data-direction",
    "backward",
  );
  await ready(page, "fall-2025");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Next scene", exact: true }).click();
  await ready(page, "winter-2026");
  await expect(page.locator(".turn-leaf")).toHaveCount(0);
});

test("supplied photo album loads every image without broken-media fallbacks", async ({
  page,
}) => {
  await page.goto("/#finale");
  await ready(page, "finale");
  await page.locator(".photo-album summary").click();
  const album = page.locator(".photo-album");
  const photoCount = Number(
    (await album.locator("summary span").innerText()).match(/^\d+/)[0],
  );
  for (let i = 0; i < photoCount; i++) {
    const image = album.locator("img");
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate((node) => node.complete && node.naturalWidth > 0),
      )
      .toBe(true);
    await expect(album.locator(".media-placeholder-label")).toHaveCount(0);
    await expect(album.locator("figcaption .mono")).toContainText(
      String(i + 1).padStart(2, "0"),
    );
    await album
      .getByRole("button", { name: "Next photo in photo album" })
      .click();
  }
});
async function ready(page, id) {
  await expect(page.locator(".scene-scroll")).toHaveAttribute("data-scene", id);
  await expect(page.locator(".scene-scroll")).toHaveCount(1);
  await expect(page.locator("[data-scene-heading]")).toBeFocused();
  if (id !== "finale")
    await expect(
      page.getByRole("button", { name: "Next scene", exact: true }),
    ).toBeEnabled();
}
async function chapter(page, id) {
  await page.getByRole("button", { name: "Chapters", exact: true }).click();
  await page.locator(`.chapter-dialog a[href="#${id}"]`).click();
  await ready(page, id);
}

test("poster YES plays the invitation and replaces it with the documentary", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await ready(page, "home");
  await page.waitForTimeout(700);
  await page.screenshot({ path: "test-results/poster-desktop.png" });
  await page.getByRole("button", { name: "No", exact: true }).hover();
  await expect(page.locator(".vote-status")).toContainText("somewhere to be");
  await page.getByRole("button", { name: "YES, I’M IN" }).click();
  await expect(page.locator('[data-scene="why"]')).toBeVisible();
  await expect(page.getByRole("heading", { name: /LET ME/ })).toBeVisible();
  await ready(page, "fall-2025");
  await expect(page.locator(".chapter-points")).toContainText(
    "30-minute games",
  );
  await page.getByRole("button", { name: "Next photo in Fall 2025" }).click();
  await expect(page.locator(".gallery figcaption")).toContainText(
    "Connections beyond the classroom.",
  );
  await page.keyboard.press("ArrowRight"); // Focus is inside the gallery: do not change scenes.
  await expect(page).toHaveURL(/#fall-2025$/);
  await page.locator("[data-scene-heading]").focus();
  await page.keyboard.press("ArrowRight");
  await ready(page, "winter-2026");
  expect(errors).toEqual([]);
});

test("deep links, browser history, keyboard boundaries, and focus management", async ({
  page,
}) => {
  await page.goto("/#spring-2026-ideas");
  await ready(page, "spring-2026-ideas");
  await expect(page.locator(".documentary-copy")).toContainText(
    "ran for IT Director reelection",
  );
  await page.getByRole("button", { name: "Next scene", exact: true }).click();
  await ready(page, "fall-2026");
  await expect(page.locator(".chapter-points")).toContainText(
    "has not happened yet because of limited funding",
  );
  await page.goBack();
  await ready(page, "spring-2026-ideas");
  await page.goForward();
  await ready(page, "fall-2026");
  await chapter(page, "vision");
  const winter = page.getByRole("button", { name: /Winter planning/ });
  await winter.click();
  await expect(page.locator("#priority-5")).toContainText(
    "different availability",
  );
  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/#vision$/);
  await page.getByRole("button", { name: "Chapters", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Chapters", exact: true }),
  ).toBeFocused();
  await page.reload();
  await ready(page, "vision");
  await page.screenshot({ path: "test-results/manifesto-desktop.png" });
});

test("rapid arrow input cannot skip a transition", async ({ page }) => {
  await page.goto("/#fall-2025");
  await ready(page, "fall-2025");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await ready(page, "winter-2026");
  await expect(page).toHaveURL(/#winter-2026$/);
});

test("reduced motion, respectful decline, inline memes, and replay", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await ready(page, "home");
  await page.getByRole("button", { name: "No", exact: true }).focus();
  await page.keyboard.press("Enter");
  await ready(page, "fall-2025");
  await chapter(page, "winter-2026");
  await page.getByRole("button", { name: /very serious intermission/ }).click();
  await expect(page.locator(".meme-moment figcaption")).toContainText(
    "My calendar",
  );
  await chapter(page, "finale");
  await page.getByRole("button", { name: "Wait. Is that it?" }).click();
  await expect(page.locator("[data-scene-heading]")).toContainText("DONE?");
  await expect(page.locator(".confetti")).toHaveCount(0);
  await page
    .getByRole("button", { name: /very serious intermission/ })
    .first()
    .click();
  await expect(page.locator(".meme-moment img")).toBeVisible();
  await page.getByRole("button", { name: "Replay the story" }).click();
  await ready(page, "home");
});

test("the supplied MP3 decodes, plays continuously, and pauses without an embed", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const NativeAudio = window.Audio;
    window.Audio = function () {
      const player = new NativeAudio();
      window.campaignAudio = player;
      return player;
    };
  });
  await page.goto("/#fall-2025");
  await ready(page, "fall-2025");
  expect(await page.evaluate(() => campaignAudio.paused)).toBe(true);
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.getByRole("button", { name: "Open music controls" }).click();
  await page.getByRole("button", { name: "Enable music" }).click();
  await expect(page.getByRole("button", { name: "Pause music" })).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => campaignAudio.currentTime))
    .toBeGreaterThan(0.1);
  const before = await page.evaluate(() => campaignAudio.currentTime);
  await page.getByRole("button", { name: "Close music controls" }).click();
  await page.getByRole("button", { name: "Next scene", exact: true }).click();
  await ready(page, "winter-2026");
  expect(await page.evaluate(() => campaignAudio.currentTime)).toBeGreaterThan(
    before,
  );
  await page.getByRole("button", { name: "Open music controls" }).click();
  await page.getByRole("button", { name: "Pause music" }).click();
  await expect.poll(() => page.evaluate(() => campaignAudio.paused)).toBe(true);
});

test("local music requires consent, persists, fades, ducks, and handles failure", async ({
  page,
}) => {
  await page.route("**/assets/audio/campaign-theme.mp3", (route) =>
    route.fulfill({ status: 200, contentType: "audio/mpeg", body: "" }),
  );
  await page.addInitScript(() => {
    const NativeAudio = window.Audio;
    window.createdPlayers = [];
    window.Audio = function () {
      const player = new NativeAudio();
      window.createdPlayers.push(player);
      player.playCalls = 0;
      player.play = async () => {
        player.playCalls++;
      };
      player.load = () => {};
      return player;
    };
  });
  await page.goto("/#winter-2026");
  await ready(page, "winter-2026");
  await page.getByRole("button", { name: "Open music controls" }).click();
  await expect(
    page.getByRole("button", { name: "Enable music" }),
  ).toBeVisible();
  const before = await page.evaluate(() => ({
    count: createdPlayers.length,
    plays: createdPlayers.at(-1).playCalls,
  }));
  expect(before.plays).toBe(0);
  await page.getByRole("button", { name: "Enable music" }).click();
  await expect(page.getByRole("button", { name: "Pause music" })).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => createdPlayers.at(-1).volume))
    .toBeCloseTo(0.3, 1);
  await page.getByLabel("Volume", { exact: false }).fill("0.5");
  await page.keyboard.press("ArrowRight"); // A volume slider must keep its keyboard behavior.
  await expect(page).toHaveURL(/#winter-2026$/);
  await page.getByRole("button", { name: "Close music controls" }).click();
  await page.getByRole("button", { name: /very serious intermission/ }).click();
  await expect
    .poll(() => page.evaluate(() => createdPlayers.at(-1).volume))
    .toBeLessThan(0.2);
  await page.getByRole("button", { name: "Next scene", exact: true }).click();
  await ready(page, "spring-2026");
  expect(await page.evaluate(() => createdPlayers.length)).toBe(before.count);
  expect(await page.evaluate(() => createdPlayers.at(-1).playCalls)).toBe(1);
  await page.getByRole("button", { name: "Open music controls" }).click();
  await page.getByRole("button", { name: "Mute music", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => createdPlayers.at(-1).volume))
    .toBe(0);
  await page.getByRole("button", { name: "Unmute music", exact: true }).click();
  await page.evaluate(() =>
    createdPlayers.at(-1).dispatchEvent(new Event("error")),
  );
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "soundtrack could not be loaded" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Enable music" }),
  ).toBeVisible();
});

test("horizontal touch gestures navigate while vertical or nested gestures do not", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#fall-2025");
  await ready(page, "fall-2025");
  const stage = page.locator(".chapter-body");
  await stage.dispatchEvent("pointerdown", {
    pointerType: "touch",
    isPrimary: true,
    clientX: 280,
    clientY: 300,
  });
  await stage.dispatchEvent("pointerup", {
    pointerType: "touch",
    isPrimary: true,
    clientX: 100,
    clientY: 310,
  });
  await ready(page, "winter-2026");
  await page.locator(".chapter-body").dispatchEvent("pointerdown", {
    pointerType: "touch",
    isPrimary: true,
    clientX: 280,
    clientY: 300,
  });
  await page.locator(".chapter-body").dispatchEvent("pointerup", {
    pointerType: "touch",
    isPrimary: true,
    clientX: 270,
    clientY: 100,
  });
  await expect(page).toHaveURL(/#winter-2026$/);
  const gallery = page.getByRole("button", {
    name: "Next photo in Winter 2026",
  });
  await gallery.dispatchEvent("pointerdown", {
    pointerType: "touch",
    isPrimary: true,
    clientX: 280,
    clientY: 300,
  });
  await gallery.dispatchEvent("pointerup", {
    pointerType: "touch",
    isPrimary: true,
    clientX: 100,
    clientY: 310,
  });
  await expect(page).toHaveURL(/#winter-2026$/);
});

for (const [width, height] of [
  [320, 568],
  [375, 667],
  [390, 844],
  [768, 1024],
  [1366, 768],
  [1920, 1080],
  [844, 390],
]) {
  test(`all scenes fit and remain internally scrollable at ${width}×${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await ready(page, "home");
    for (const id of sceneIds) {
      if (id !== "home") {
        await page.evaluate((id) => {
          location.hash = id;
        }, id);
        await ready(page, id);
      }
      const layout = await page.evaluate(() => {
        const scene = document.querySelector(".scene-scroll");
        const headline = document.querySelector("[data-scene-heading]");
        return {
          bodyFits: document.documentElement.scrollWidth <= innerWidth,
          sceneFits: scene.scrollWidth <= scene.clientWidth + 1,
          headlineFits: headline.scrollWidth <= headline.clientWidth + 1,
          documentFits:
            document.documentElement.scrollHeight <= innerHeight + 1,
        };
      });
      expect(layout, id).toEqual({
        bodyFits: true,
        sceneFits: true,
        headlineFits: true,
        documentFits: true,
      });
      await page.locator(".scene-scroll").evaluate((el) => {
        el.scrollTop = el.scrollHeight;
      });
      await expect(
        page.getByRole("button", { name: "Next scene", exact: true }),
      ).toBeInViewport();
      await expect(
        page.getByRole("button", { name: "Open music controls" }),
      ).toBeInViewport();
    }
    if ([390, 1366, 768].includes(width)) {
      await chapter(page, "home");
      await page.screenshot({ path: `test-results/poster-${width}.png` });
      await chapter(page, "fall-2026");
      await page.screenshot({ path: `test-results/timeline-${width}.png` });
    }
  });
}
