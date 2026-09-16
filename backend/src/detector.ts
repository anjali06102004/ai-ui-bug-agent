import { Page } from "playwright";
import { UIBug } from "./types.js";

export async function detectUIBugs(page: Page): Promise<UIBug[]> {
  const bugs: UIBug[] = [];

  // 1. Broken images
  const brokenImages = await page.locator("img").evaluateAll((images) =>
    images
      .map((img) => ({
        src: (img as HTMLImageElement).src,
        naturalWidth: (img as HTMLImageElement).naturalWidth,
      }))
      .filter((img) => img.src && img.naturalWidth === 0)
  );

  for (const image of brokenImages) {
    bugs.push({
      type: "broken-image",
      severity: "medium",
      message: `Image failed to load: ${image.src}`,
      element: "img",
    });
  }

  // 2. Elements with zero dimensions
  const zeroSizeElements = await page.locator(
    "button:visible, a:visible, input:visible, textarea:visible, select:visible, img:visible"
  ).evaluateAll((elements) =>
    elements
      .map((el) => {
        const rect = el.getBoundingClientRect();

        return {
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || "").trim().slice(0, 80),
          width: rect.width,
          height: rect.height,
        };
      })
      .filter((el) => el.width === 0 || el.height === 0)
  );

  for (const element of zeroSizeElements) {
    bugs.push({
      type: "zero-size-element",
      severity: "medium",
      message: `${element.tag} has zero width or height`,
      element: element.text || element.tag,
    });
  }

  // 3. Horizontal page overflow
  const overflow = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));

  if (overflow.documentWidth > overflow.viewportWidth + 5) {
    bugs.push({
      type: "horizontal-overflow",
      severity: "medium",
      message: `Page content width (${overflow.documentWidth}px) exceeds viewport (${overflow.viewportWidth}px)`,
    });
  }

  // 4. Elements positioned outside the viewport
//   const offScreenElements = await page.locator(
//     "button, a, input, textarea, select"
//   ).evaluateAll((elements) =>
//     elements
//       .map((el) => {
//         const rect = el.getBoundingClientRect();

//         return {
//           tag: el.tagName.toLowerCase(),
//           text: (el.textContent || "").trim().slice(0, 80),
//           left: rect.left,
//           right: rect.right,
//           top: rect.top,
//           bottom: rect.bottom,
//         };
//       })
//       .filter(
//         (el) =>
//           el.right < 0 ||
//           el.left > window.innerWidth ||
//           el.bottom < 0 ||
//           el.top > window.innerHeight
//       )
//   );

//   for (const element of offScreenElements) {
//     bugs.push({
//       type: "off-screen-element",
//       severity: "low",
//       message: `${element.tag} is outside the current viewport`,
//       element: element.text || element.tag,
//     });
//   }

  return bugs;
}