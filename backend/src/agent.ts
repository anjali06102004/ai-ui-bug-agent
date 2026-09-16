import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { explorePage } from "./explorer.js";
import { PageData } from "./types.js";

async function runAgent(startUrl: string) {
  const browser = await chromium.launch({
    headless: false,
  });

  const context = await browser.newContext({
    viewport: {
      width: 1280,
      height: 720,
    },
  });

  const page = await context.newPage();

  const screenshotDir = path.resolve("screenshots");

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const start = new URL(startUrl);
  const visited = new Set<string>();
  const queue: string[] = [start.href];
  const results: PageData[] = [];

  const maxPages = 10;

  while (queue.length > 0 && visited.size < maxPages) {
    const currentUrl = queue.shift();

    if (!currentUrl) continue;

    const normalizedUrl = normalizeUrl(currentUrl);

    if (visited.has(normalizedUrl)) {
      continue;
    }

    if (!isInternalUrl(normalizedUrl, start.hostname)) {
      continue;
    }

    visited.add(normalizedUrl);

    const screenshotName = `page-${visited.size}.png`;
    const screenshotPath = path.join(
      screenshotDir,
      screenshotName
    );

    const pageData = await explorePage(
      page,
      normalizedUrl,
      screenshotPath
    );

    results.push(pageData);

    for (const link of pageData.links) {
      const normalizedLink = normalizeUrl(link);

      if (
        isInternalUrl(normalizedLink, start.hostname) &&
        !visited.has(normalizedLink) &&
        !queue.includes(normalizedLink)
      ) {
        queue.push(normalizedLink);
      }
    }
  }

  console.log("\n========== EXPLORATION COMPLETE ==========");
  console.log(`Pages visited: ${visited.size}`);

  for (const result of results) {
    console.log("\n--------------------------------");
    console.log("URL:", result.url);
    console.log("Title:", result.title);
    console.log("Buttons:", result.buttons);
    console.log("Inputs:", result.inputs);
    console.log("Headings:", result.headings);
    console.log("Console Errors:", result.consoleErrors);
    console.log("Screenshot:", result.screenshot);
  }

  await fs.promises.writeFile(
    "exploration-results.json",
    JSON.stringify(results, null, 2)
  );

  console.log("\nSaved: exploration-results.json");

  await browser.close();
}

function normalizeUrl(url: string): string {
  const parsed = new URL(url);

  parsed.hash = "";

  if (parsed.pathname !== "/" && parsed.pathname.endsWith("/")) {
    parsed.pathname = parsed.pathname.slice(0, -1);
  }

  return parsed.href;
}

function isInternalUrl(
  url: string,
  hostname: string
): boolean {
  try {
    const parsed = new URL(url);

    return (
      parsed.hostname === hostname &&
      ["http:", "https:"].includes(parsed.protocol)
    );
  } catch {
    return false;
  }
}

const url = process.argv[2];

if (!url) {
  console.log(
    "Please provide a URL.\nExample: npm run agent https://example.com"
  );
  process.exit(1);
}

runAgent(url);