const ts = require("typescript"),
  fs = require("node:fs"),
  path = require("node:path");
const entries = new Set();
function visit(file) {
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  function walk(node) {
    if (ts.isJsxText(node)) {
      const value = node.text.replace(/\s+/g, " ").trim();
      if (value) entries.add(value);
    }
    if (
      ts.isStringLiteral(node) &&
      !ts.isImportDeclaration(node.parent) &&
      !ts.isExportDeclaration(node.parent)
    ) {
      const value = node.text.replace(/\s+/g, " ").trim();
      if (/^[A-Z][A-Za-z]/.test(value) && !/^(GET|POST)$/.test(value))
        entries.add(value);
    }
    ts.forEachChild(node, walk);
  }
  walk(source);
}
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (
      /\.(tsx|ts)$/.test(p) &&
      !p.includes("/i18n/") &&
      !p.endsWith("demoRepository.ts")
    )
      visit(p);
  }
}
walk("apps/mobile/src");
walk("apps/mobile/app");
if (process.argv.includes("--check")) {
  const en = JSON.parse(
    fs.readFileSync("apps/mobile/src/i18n/en.json", "utf8"),
  );
  const missing = [...entries].filter((k) => !(k in en));
  if (missing.length) {
    console.error("Missing localization keys:", missing);
    process.exit(1);
  }
  console.log(`PASS: ${entries.size} static UI keys have resources.`);
} else {
  fs.mkdirSync(".local", { recursive: true });
  fs.writeFileSync(
    ".local/ui-strings.json",
    JSON.stringify([...entries].sort(), null, 2),
  );
  console.log(entries.size);
}
