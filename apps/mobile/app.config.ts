import type { ExpoConfig, ConfigContext } from "expo/config";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
export default ({ config }: ConfigContext): ExpoConfig => {
  const version = readFileSync(
    resolve(__dirname, "../../VERSION"),
    "utf8",
  ).trim();
  let sha = process.env.GITHUB_SHA?.slice(0, 7) ?? "unknown";
  try {
    sha = execFileSync("git", ["rev-parse", "--short=7", "HEAD"], {
      cwd: __dirname,
    })
      .toString()
      .trim();
  } catch {
    /* Source archives may have no Git. */
  }
  const [major, minor] = version.split(".");
  return {
    ...config,
    name: "Snowmate",
    slug: "snowmate",
    version: version.split("-")[0],
    extra: {
      ...config.extra,
      build: {
        version,
        milestone: `M${major}.${minor}`,
        sha,
        development: version.includes("-"),
      },
    },
  };
};
