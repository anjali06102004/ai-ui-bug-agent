import { Page } from "playwright";
import { PageData } from "./types.js";
import { detectUIBugs } from "./detector.js";

export async function explorePage(
  page: Page,
  url: string,
  screenshotPath: string
): Promise<PageData> {
  const consoleErrors: string[] = [];

  const consoleHandler = (msg: any) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  };

  page.on("console", consoleHandler);

  try {
    console.log(`\nExploring: ${url}`);

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await page.waitForTimeout(1500);

    // Initial screenshot
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    const title = await page.title();

    const links = await page.locator("a").evaluateAll((elements) =>
      elements
        .map((el) => ({
          text: (el.textContent || "").trim(),
          href: (el as HTMLAnchorElement).href,
        }))
        .filter((item) => item.href)
    );

    const buttons = await page.locator("button").allTextContents();

    const inputs = await page.locator("input").count();

    const headings = await page.locator("h1, h2, h3").allTextContents();

    // -----------------------------
    // STEP 3: INTERACTION
    // -----------------------------

    console.log("Checking scroll behavior...");

    await page.evaluate(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "instant",
      });
    });

    await page.waitForTimeout(500);

    await page.screenshot({
      path: screenshotPath.replace(".png", "-bottom.png"),
      fullPage: false,
    });

    await page.evaluate(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    });

    // Find safe buttons
    const buttonData = await page.locator("button").evaluateAll((elements) =>
      elements.map((el, index) => ({
        index,
        text: (el.textContent || "").trim(),
        disabled: (el as HTMLButtonElement).disabled,
      }))
    );

    for (const button of buttonData) {
      const text = button.text.toLowerCase();

      // Avoid actions that could submit/delete/purchase/logout
      const dangerousWords = [
       "submit",
       "delete",
       "remove",
       "logout",
       "log out",
       "purchase",
       "pay",
       "buy",
       "send",
       "confirm",
       "google",
       "github",
       "linkedin",
       "login",
       "log in",
       "sign up",
       "signup",
       "select plan",
     ];

      const isDangerous = dangerousWords.some((word) =>
        text.includes(word)
      );

    if (button.disabled || isDangerous || !button.text) {
          console.log(`Skipping unsafe button: "${button.text}"`);
          continue;
        }
        
        try {
          const locator = page.locator("button").nth(button.index);
        
          // Check if button is actually visible and enabled
          const isVisible = await locator.isVisible().catch(() => false);
          const isEnabled = await locator.isEnabled().catch(() => false);
        
          if (!isVisible || !isEnabled) {
            console.log(
              `Skipping invisible/disabled button: "${button.text}"`
            );
            continue;
          }
        
          console.log(`Clicking safe button: "${button.text}"`);
        
          await locator.scrollIntoViewIfNeeded();
        
          await locator.click({
            timeout: 5000,
          });

        await page.waitForTimeout(800);

        console.log(`Clicked: "${button.text}"`);

        // Go back if click caused navigation
        const originalOrigin = new URL(url).origin;

       if (
            page.url() !== url &&
            new URL(page.url()).origin === originalOrigin
          ) {     await page.goBack({
            waitUntil: "domcontentloaded",
            timeout: 10000,
          }).catch(() => {});
        }
      } catch (error) {
        console.log(
          `Could not click "${button.text}": ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    // Inspect input fields without submitting anything
    const inputData = await page.locator("input, textarea, select").evaluateAll(
      (elements) =>
        elements.map((el, index) => ({
          index,
          tag: el.tagName.toLowerCase(),
          type: (el as HTMLInputElement).type || null,
          name: (el as HTMLInputElement).name || null,
          placeholder:
            (el as HTMLInputElement).placeholder || null,
          required:
            (el as HTMLInputElement).required || false,
          disabled:
            (el as HTMLInputElement).disabled || false,
        }))
    );

    const bugs = await detectUIBugs(page);

    console.log("\nPotential UI bugs:");
    
    for (const bug of bugs) {
      console.log(
        `[${bug.severity.toUpperCase()}] ${bug.type}: ${bug.message}`
      );
    }

    console.log("\nInteractive elements:");

    console.log("Buttons:", buttonData);
    console.log("Inputs:", inputData);

    const finalButtons = await page.locator("button").allTextContents();
    const finalInputs = await page.locator("input").count();
    const finalHeadings = await page.locator("h1, h2, h3").allTextContents();


    return {
      url: page.url(),
      title,
      links: links.map((link) => link.href),
      buttons: finalButtons
        .map((button) => button.trim())
        .filter(Boolean),
      
      inputs: finalInputs,
      
      headings: finalHeadings
        .map((heading) => heading.trim())
        .filter(Boolean),
      screenshot: screenshotPath,
      consoleErrors,
      bugs,
    };
  } catch (error) {
    return {
      url,
      title: "",
      links: [],
      buttons: [],
      inputs: 0,
      headings: [],
      screenshot: screenshotPath,
      consoleErrors: [
        ...consoleErrors,
        error instanceof Error ? error.message : String(error),
      ],
      bugs: [],
    };
  } finally {
    page.removeListener("console", consoleHandler);
  }
}