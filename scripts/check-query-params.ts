/**
 * Headless checks for Maze Game query-parameter URLs.
 * Run: node scripts/check-query-params.ts (preview on http://127.0.0.1:4173)
 */
import { chromium, type Page } from "@playwright/test";

/** The slice of the sim's `phet` global these checks read, evaluated in the page. */
type PhetGlobal = {
  phet?: {
    chipper?: {
      isProduction: boolean;
      isFuzzEnabled?: () => boolean;
      queryParameters: {
        ea: unknown;
        dev: unknown;
        fuzz: unknown;
        fuzzBoard: unknown;
        stringTest: unknown;
        locale: unknown;
        showPointerAreas: unknown;
        supportsInteractiveDescription: unknown;
        listenerOrder: unknown;
        logInteractiveDescriptionResponses: unknown;
      };
    };
    joist?: { sim?: unknown };
  };
};

type FocusInfo = { tag: string; role: string | null; ariaLabel: string | null; id: string | null; inPdom: boolean };

type Result = {
  name: string;
  url: string;
  simStarted: boolean;
  loadError: string | null;
  queryState: Record<string, unknown> | null;
  tabSequence?: FocusInfo[];
  consoleErrors: string[];
  assertionFailures: string[];
  pass: boolean;
};

const BASE = process.env["MAZE_GAME_URL"] ?? "http://127.0.0.1:4173/";

const TEST_URLS = [
  { name: "baseline", query: "" },
  { name: "ea", query: "?ea" },
  { name: "dev+pointerAreas", query: "?dev&showPointerAreas" },
  { name: "stringTest-double", query: "?stringTest=double" },
  { name: "stringTest-long", query: "?stringTest=long" },
  { name: "fuzz+ea+disableModals", query: "?fuzz&ea&disableModals&fuzzRate=30" },
  { name: "fuzzBoard+ea", query: "?fuzzBoard&ea&fuzzRate=20" },
  { name: "listenerOrder-random", query: "?fuzz&ea&listenerOrder=random&fuzzRate=20&disableModals" },
  { name: "locale-fr", query: "?locale=fr&ea" },
  { name: "log-a11y", query: "?logInteractiveDescriptionResponses&ea" },
];

const FUZZ_RUN_MS = 8000;
const LOAD_TIMEOUT_MS = 60000;

function readQueryState(page: Page): Promise<Record<string, unknown>> {
  return page.evaluate(() => {
    const chipper = (globalThis as PhetGlobal).phet?.chipper;
    if (!chipper) {
      return { error: "phet.chipper not available" };
    }
    const qp = chipper.queryParameters;
    return {
      isProduction: chipper.isProduction,
      isFuzzEnabled: chipper.isFuzzEnabled?.(),
      ea: qp.ea,
      dev: qp.dev,
      fuzz: qp.fuzz,
      fuzzBoard: qp.fuzzBoard,
      stringTest: qp.stringTest,
      locale: qp.locale,
      showPointerAreas: qp.showPointerAreas,
      supportsInteractiveDescription: qp.supportsInteractiveDescription,
      listenerOrder: qp.listenerOrder,
      logInteractiveDescriptionResponses: qp.logInteractiveDescriptionResponses,
    };
  });
}

function attachConsole(page: Page): { errors: string[]; assertionFailures: string[] } {
  const errors: string[] = [];
  const assertionFailures: string[] = [];
  page.on("console", (msg) => {
    const text = msg.text();
    if (msg.type() === "error") {
      errors.push(text);
    }
    if (text.includes("Assertion failed")) {
      assertionFailures.push(text);
    }
  });
  page.on("pageerror", (err) => {
    errors.push(err.message);
  });
  return { errors, assertionFailures };
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const results: Result[] = [];

try {
  for (const { name, query } of TEST_URLS) {
    const root = BASE.replace(/\/?$/, "");
    const fixedUrl = query ? `${root}${query.startsWith("?") ? query : `?${query}`}` : `${root}/`;

    const page = await context.newPage();
    const { errors, assertionFailures } = attachConsole(page);

    let loadError: string | null = null;
    let queryState: Record<string, unknown> | null = null;
    let simStarted = false;

    try {
      await page.goto(fixedUrl, { waitUntil: "load", timeout: LOAD_TIMEOUT_MS });
      await page.waitForFunction(() => (globalThis as PhetGlobal).phet?.joist?.sim !== undefined, {
        timeout: LOAD_TIMEOUT_MS,
      });
      simStarted = true;
      queryState = await readQueryState(page);

      const needsFuzz = query.includes("fuzz");
      if (needsFuzz) {
        await sleep(FUZZ_RUN_MS);
      } else if (query.includes("stringTest") || query.includes("dev")) {
        await sleep(2000);
      } else {
        await sleep(1500);
      }
    } catch (err) {
      loadError = err instanceof Error ? err.message : String(err);
    }

    results.push({
      name,
      url: fixedUrl,
      simStarted,
      loadError,
      queryState,
      consoleErrors: [...errors],
      assertionFailures: [...assertionFailures],
      pass: !loadError && assertionFailures.length === 0,
    });

    await page.close();
  }

  // A11y: Tab through PDOM on ?ea (focus order smoke test)
  const a11yRoot = BASE.replace(/\/?$/, "");
  const a11yUrl = `${a11yRoot}?ea`;
  const a11yPage = await context.newPage();
  const a11yErrors: string[] = [];
  a11yPage.on("pageerror", (err) => a11yErrors.push(err.message));

  const tabSequence: FocusInfo[] = [];
  try {
    await a11yPage.goto(a11yUrl, { waitUntil: "load", timeout: LOAD_TIMEOUT_MS });
    await a11yPage.waitForFunction(() => (globalThis as PhetGlobal).phet?.joist?.sim !== undefined, {
      timeout: LOAD_TIMEOUT_MS,
    });
    await a11yPage
      .locator("#sim")
      .click({ timeout: 5000 })
      .catch(() => undefined);

    for (let i = 0; i < 12; i++) {
      await a11yPage.keyboard.press("Tab");
      await sleep(120);
      const focus = await a11yPage.evaluate((): FocusInfo | null => {
        const el = document.activeElement;
        if (!el) {
          return null;
        }
        const pdom = el.closest?.("[data-parallel-dom]");
        return {
          tag: el.tagName,
          role: el.getAttribute("role"),
          ariaLabel: el.getAttribute("aria-label"),
          id: el.id || null,
          inPdom: Boolean(pdom),
        };
      });
      if (focus) {
        tabSequence.push(focus);
      }
    }
  } catch (err) {
    a11yErrors.push(err instanceof Error ? err.message : String(err));
  } finally {
    await a11yPage.close();
  }

  const a11yPass = a11yErrors.length === 0 && tabSequence.length >= 3;
  results.push({
    name: "a11y-tab-order",
    url: a11yUrl,
    simStarted: tabSequence.length > 0,
    loadError: a11yErrors[0] ?? null,
    queryState: null,
    tabSequence,
    consoleErrors: a11yErrors,
    assertionFailures: [],
    pass: a11yPass,
  });
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.pass);
console.log(JSON.stringify({ summary: { total: results.length, failed: failed.length }, results }, null, 2));
process.exit(failed.length > 0 ? 1 : 0);
