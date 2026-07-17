import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { ZodError } from "zod";
import {
  getMissingLiveFields,
  listingFileUrl,
  parseListing,
  ListingParseError,
} from "../src/lib/listing-parser";

try {
  const listing = parseListing(readFileSync(fileURLToPath(listingFileUrl), "utf8"));
  const missing = getMissingLiveFields(listing);
  const isLive = process.env.PUBLICATION_MODE === "live";

  if (missing.length > 0) {
    const heading = isLive ? "Canlı yayın için eksik alanlar:" : "Taslak içerikte bekleyen alanlar:";
    console.warn(`${heading}\n- ${missing.join("\n- ")}`);
    if (isLive) process.exitCode = 1;
  } else {
    console.log("Araç içeriği canlı yayın için hazır.");
  }
} catch (error) {
  if (error instanceof ListingParseError) {
    console.error(error.message);
  } else if (error instanceof ZodError) {
    for (const issue of error.issues) {
      console.error(`${issue.path.join(".")}: ${issue.message}`);
    }
  } else {
    console.error(error);
  }
  process.exitCode = 1;
}
