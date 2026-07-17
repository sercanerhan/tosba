import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";

type Scores = Record<"performance" | "accessibility" | "best-practices" | "seo", number>;

const target = process.env.TARGET_URL ?? "http://127.0.0.1:4321";
const runs = Number(process.env.LIGHTHOUSE_RUNS ?? "3");
const minimumScore = Number(process.env.LIGHTHOUSE_MIN_SCORE ?? "95");
const targetScore = Number(process.env.LIGHTHOUSE_TARGET_SCORE ?? "100");
const categories = ["performance", "accessibility", "best-practices", "seo"] as const;

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

async function audit(formFactor: "mobile" | "desktop"): Promise<Scores> {
  const results: Scores[] = [];
  for (let index = 0; index < runs; index += 1) {
    const chrome = await launch({ chromeFlags: ["--headless=new", "--no-sandbox"] });
    try {
      const report = await lighthouse(target, {
        port: chrome.port,
        logLevel: "error",
        output: "json",
        onlyCategories: [...categories],
        formFactor,
        screenEmulation: formFactor === "desktop"
          ? { mobile: false, width: 1440, height: 1000, deviceScaleFactor: 1, disabled: false }
          : { mobile: true, width: 375, height: 812, deviceScaleFactor: 2, disabled: false },
      }, formFactor === "desktop" ? desktopConfig : undefined);
      if (!report) throw new Error("Lighthouse raporu üretilemedi.");
      results.push(Object.fromEntries(categories.map((id) => [
        id,
        Math.round((report.lhr.categories[id]?.score ?? 0) * 100),
      ])) as Scores);
    } finally {
      chrome.kill();
    }
  }

  return Object.fromEntries(categories.map((id) => [id, median(results.map((result) => result[id]))])) as Scores;
}

const summary = {
  mobile: await audit("mobile"),
  desktop: await audit("desktop"),
};

console.table(summary);
const targetGaps = Object.entries(summary).flatMap(([mode, scores]) =>
  Object.entries(scores).filter(([, score]) => score < targetScore).map(([category, score]) => `${mode}.${category}: ${score}`),
);
const failures = Object.entries(summary).flatMap(([mode, scores]) =>
  Object.entries(scores).filter(([, score]) => score < minimumScore).map(([category, score]) => `${mode}.${category}: ${score}`),
);

if (targetGaps.length) {
  console.warn(`Lighthouse ${targetScore} hedefinin altında kalanlar: ${targetGaps.join(", ")}`);
}

if (failures.length) {
  throw new Error(`Lighthouse asgari ${minimumScore} eşiği karşılanmadı: ${failures.join(", ")}`);
}
