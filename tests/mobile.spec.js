import { test, expect } from "@playwright/test";

test("iPhone WebKit supports touch, page turns, chapters, GIFs, and orientation changes", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("[data-scene-heading]")).toBeFocused();
  await page.getByRole("button", { name: "YES, I’M IN" }).tap();
  await expect(page.locator('[data-scene="why"]')).toBeVisible();
  await expect(page.locator('[data-scene="fall-2025"]')).toBeVisible();
  await expect(page.locator("[data-scene-heading]")).toBeFocused();
  await page.getByRole("button", { name: "Chapters", exact: true }).tap();
  await page.locator('.chapter-dialog a[href="#finale"]').tap();
  await expect(page.locator('[data-scene="finale"]')).toBeVisible();
  await expect(page.locator("[data-scene-heading]")).toBeFocused();
  await page.getByRole("button", { name: "Wait. Is that it?" }).tap();
  await page.getByRole("button", { name: "Pause GIF", exact: true }).tap();
  await expect(page.locator(".finale-cat img")).toHaveAttribute(
    "src",
    "/assets/gifs/cat-still.webp",
  );
  await page.getByRole("button", { name: "Open music controls" }).tap();
  await expect(
    page.getByRole("button", { name: "Enable music" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close music controls" }).tap();
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [844, 390],
    [768, 1024],
  ]) {
    await page.setViewportSize({ width, height });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const next = await page
      .getByRole("button", { name: "Next scene", exact: true })
      .boundingBox();
    const music = await page
      .getByRole("button", { name: "Open music controls" })
      .boundingBox();
    expect(
      next.x >= music.x + music.width ||
        music.x >= next.x + next.width ||
        next.y >= music.y + music.height ||
        music.y >= next.y + next.height,
    ).toBe(true);
    await expect(
      page.getByRole("button", { name: "Chapters", exact: true }),
    ).toBeInViewport();
  }
  expect(errors).toEqual([]);
});
