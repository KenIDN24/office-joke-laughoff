// One-Line Office Joke Laugh-Off — entry program.
// Writes the single-line office joke to /output/entry.txt,
// guarded to the sealed gate: UTF-8 text, 1-200 characters,
// not only whitespace, exactly one line.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "My desk plant died of secondhand stress, so HR reclassified it as a witness.";

const MIN_CHARS = 1;
const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`entry rejected: ${message}`);
  process.exit(1);
}

if (LINE.length < MIN_CHARS || LINE.length > MAX_CHARS) {
  fail(`entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  fail("entry must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("entry must be exactly one line");
}
// Reject control characters (other than the trailing newline we add)
// so no invisible junk can slip into the entry.
for (const ch of LINE) {
  if (ch.charCodeAt(0) < 0x20 && ch !== "\t") {
    fail("entry must not contain control characters");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE + "\n", "utf8");
// Read-back check: the file on disk must be exactly the line + newline.
const written = readFileSync(outPath, "utf8");
if (written !== LINE + "\n") {
  fail("entry.txt on disk does not match the line");
}
console.log(`wrote entry.txt (${LINE.length} characters)`);
