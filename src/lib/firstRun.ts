import { writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const FLAG_PATH = path.join(process.cwd(), "first-run-flag.txt");

export async function isFirstRun(): Promise<boolean> {
  return !existsSync(FLAG_PATH);
}

export async function markFirstRunComplete() {
  await writeFile(FLAG_PATH, "done");
}
