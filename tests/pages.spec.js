import { test, expect } from "@playwright/test";

test("production Pages subdirectory loads photos, logo, texture, GIF, and audio", async ({
  page,
  request,
}) => {
  const failures = [];
  page.on("response", (response) => {
    if (response.status() >= 400) failures.push(response.url());
  });
  await page.goto("./");
  await expect(page.locator("[data-scene-heading]")).toBeFocused();
  const logo = page
    .getByRole("img", { name: "ALPFA NJIT chapter logo" })
    .first();
  await expect(logo).toHaveAttribute(
    "src",
    "/alpfa-president-campaign/assets/logos/alpfa-njit.png",
  );
  await expect
    .poll(() => logo.evaluate((img) => img.complete && img.naturalWidth > 0))
    .toBe(true);
  for (const img of await page.locator(".cover-collage img").all()) {
    await expect
      .poll(() =>
        img.evaluate((node) => node.complete && node.naturalWidth > 0),
      )
      .toBe(true);
    expect(
      await img.evaluate((node) => new URL(node.currentSrc).pathname),
    ).toContain("/alpfa-president-campaign/assets/");
  }
  expect(
    await page
      .locator(".scene-scroll")
      .evaluate((node) => getComputedStyle(node).backgroundImage),
  ).toContain("/alpfa-president-campaign/assets/paper-grain.svg");
  await page.getByRole("button", { name: "Chapters", exact: true }).click();
  await page.locator('.chapter-dialog a[href="#finale"]').click();
  await expect(page.locator("[data-scene-heading]")).toBeFocused();
  await page.getByRole("button", { name: "Wait. Is that it?" }).click();
  await expect(page.locator(".finale-cat img")).toHaveAttribute(
    "src",
    "/alpfa-president-campaign/assets/gifs/cat-catmeme.gif",
  );
  await page.getByRole("button", { name: "Open music controls" }).click();
  await page.getByRole("button", { name: "Enable music" }).click();
  await expect(page.getByRole("button", { name: "Pause music" })).toBeVisible();
  const audio = await request.get("assets/audio/campaign-theme.mp3", {
    headers: { Range: "bytes=0-511" },
  });
  expect([200, 206]).toContain(audio.status());
  expect(audio.headers()["content-type"]).toContain("audio/");
  expect(failures).toEqual([]);
});
